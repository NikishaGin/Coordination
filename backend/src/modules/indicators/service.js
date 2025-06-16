import * as models from "./models.js"
import { indicatorsGetters, findAggregatedIndicators } from "./LogicIndicators.js";
import { selectFieldsOccupancy, tableActives } from '../../queries/selectors.js';


const getActivesTables = async inn => {
    const modifier = (query, nameActive) => {
        const costName  = nameActive === "debit" ? "total_sum" : "cost";
        query.select({ cost: costName }).modify(selectFieldsOccupancy)
    }
    await tableActives(inn, modifier);
};


// Индикаторы для каждого конкретного имущества
export async function insertIndicatorsToActives(inn) {
    const execMinDate = new Date(await models.getExecMinDate(inn))
    const activesTables = await getActivesTables(inn);

    for (const nameActive in activesTables) {
        for (const row of activesTables[nameActive]) {
            row.indicators = {}
            Object.entries(indicatorsGetters).forEach(
                ([ nameIndicator, getterIndicator ]) => {
                    row.indicators[nameIndicator] = getterIndicator(execMinDate, row)
                }
            )
        }
    }
}


// Агрегированные индикаторы
export async function aggregateIndicators(inn) {
    const IS_UPDATED_DELTA =  7 * 24 * 60 * 60 * 1000
    const maxLoadDate =  await models.getMaxLoadDate(inn)
    const isUpdated = (Date.now() - new Date(maxLoadDate)) <= IS_UPDATED_DELTA;
    const isLizingFNS = await models.isLizingFNS(inn)

    const activesTables = getActivesTables(inn);
    await insertIndicatorsToActives(activesTables, inn)

    const allActivesValues = Object.values(activesTables).flat()
    if (allActivesValues.length > 0) {
        const result = allActivesValues.reduce((itemCurr, item) => {
            findAggregatedIndicators(itemCurr, item, "arrest_sum", "arrest")
            findAggregatedIndicators(itemCurr, item, "evaluation_sum", "evaluation")
            findAggregatedIndicators(itemCurr, item, "realization_property_sum", "submitRealizationFirstStage")
            findAggregatedIndicators(itemCurr, item, "price_reduction_sum", "submitRealizationSecondStage")
            findAggregatedIndicators(itemCurr, item, "price_reduction_sum", "realizationSecondStage")
            findAggregatedIndicators(itemCurr, item, "dz_foreclose_sum", "collectionAccountsReceivable")
            return itemCurr
        }, allActivesValues[0])
        return { ...result.indicators, isUpdated, isLizingFNS }
    } else {
        const zeroedIndicators = Object.fromEntries(
            Object.keys(indicatorsGetters).map(nameIndicators => [nameIndicators, 0])
        );
        return { ...zeroedIndicators, isUpdated, isLizingFNS }
    }
}


// Определение обеспечение арестом
export async function securingArrest(row) {
    const activesTables = getActivesTables(row.inn);

    const currDebt = (typeof row.cur_debt === "number")
        ? row.cur_debt
        : parseFloat(row.cur_debt)

    const arrest = (typeof row.arrest_sum === "number")
        ? row.arrest_sum
        : parseFloat(row.arrest_sum)

    const activesValues = Object.values(activesTables).flat()

    if (arrest >= currDebt)
        return 1
    if ((arrest < currDebt) && (activesValues.every(item => item.arrest_propperty && item.arrest_sum)))
        return 2
    if ((arrest < currDebt) && (activesValues.some(item => item.cost && !(item.arrest_propperty && item.arrest_sum))))
        return 3
    return 4
}
