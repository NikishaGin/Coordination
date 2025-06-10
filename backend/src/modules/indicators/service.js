// import { actives } from "../../queries/selectors.js"
import * as models from "./models.js"
import { indicatorsGetters, findAggregatedIndicators } from "./LogicIndicators.js";



// Индикаторы для каждого конкретного имущества
export async function insertIndicatorsToActives(activesTables, inn) {
    const execMinDate = new Date(await models.getExecMinDate(inn))
    for (const nameActive in activesTables) {
        for (const row of activesTables[nameActive]) {
            row.indicators = {}
            Object.entries(indicatorsGetters).forEach(([nameIndicator, getterIndicator]) => {
                row.indicators[nameIndicator] = getterIndicator(execMinDate, row)
            })
        }
    }
}


// Агрегированные индикаторы
export async function aggregateIndicators(inn, activesTables) {
    const IS_UPDATED_DELTA =  7 * 24 * 60 * 60 * 1000
    const maxLoadDate =  await models.getMaxLoadDate(inn)
    const isUpdated = (Date.now() - new Date(maxLoadDate)) <= IS_UPDATED_DELTA;
    const isLizingFNS = await models.isLizingFNS(inn)
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
    } else
        return { ...Object.fromEntries(Object.keys(indicatorsGetters).map(nameIndicators => [nameIndicators, 0])), isUpdated, isLizingFNS }
}


// Определение обеспечение арестом
export async function securingArrest(row, activesTables) {
    const currDebt = (typeof row.cur_debt === "number") ? row.cur_debt : parseFloat(row.cur_debt)
    const arrest = (typeof row.arrest === "number") ? row.arrest : parseFloat(row.arrest)
    const activesValues = Object.values(activesTables).flat()
    if (arrest >= currDebt)
        return 1
    else if ((arrest < currDebt) && (activesValues.every(item => item.arrest_propperty && item.arrest_sum)))
        return 2
    else if ((arrest < currDebt) && (activesValues.some(item => item.cost && !(item.arrest_propperty && item.arrest_sum))))
        return 3
    else
        return 4
}


