import db from "../connection.js"
import * as subqueries from "./subqueries.js"
import { ROLES } from '../types.js';
import { securingArrest } from "../modules/indicators/service.js";
import * as models from '../modules/indicators/models.js';
import { indicatorsGetters } from '../modules/indicators/LogicIndicators.js';

const sumPrices = (tableNames, field) => {
    return db.ref(
        db.raw(tableNames.map(table => `IFNULL(${table}.${field}, 0.00)`).join(" + "))
    ).as(field);
}


const getModifiersApply = modifiers => {
    return query =>
        modifiers.forEach(modifier => modifier(query));
};


export async function tableActives(inn, modifyFunc=() => undefined) {
    return {
        transport: await db("transport")
            .where({inn})
            .andWhere("status", "<>", 2)
            .modify(query => modifyFunc(query, "transport")),

        property: await db("property")
            .where({inn, type_id: 2})
            .andWhere("status", "<>", 2)
            .modify(query => modifyFunc(query, "property")),

        ground: await db("property")
            .where({inn, type_id: 4})
            .andWhere("status", "<>", 2)
            .modify(query => modifyFunc(query, "ground")),

        debit: await db("debit")
            .where({inn})
            .modify(query => modifyFunc(query, "debit")),

        another: await db("another")
            .where({inn})
            .modify(query => modifyFunc(query, "another"))
    }
}


export const selectFieldsOccupancy = query => {
    query
        .select("arrest_propperty")
        .select("arrest_sum")
        .select("wanted_open")
        .select("wanted_close")
        .select("wanted_result")
        .select("evaluation_submit")
        .select("evaluation_accept")
        .select("evaluation_sum")
        .select("realization_submit")
        .select("realization_result_1")
        .select("not_realization_notification")
        .select("not_realization_notification_2")
        .select("price_reduction_sum")
}


export const actives = {
    getTables(regionCode, is_derivative_debt, is_archive, role) {
        return db('meta')
            .select(db.ref("meta.inn").as("inn"))
            .select(db.ref("meta.name").as("name"))
            .select(db.ref("debt_type.debt_type").as("category"))
            .select(db.ref("meta.sosp_code").as("sosp_code"))
            .select(db.ref("meta.kno").as("kno"))
            .select(db.ref("resolutions_data.post_sum").as("post_sum"))
            .select(db.ref("resolutions_data.cur_debt").as("cur_debt"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "total_sum"))
            .select(db.ref(db.raw(`
                CASE
                    WHEN resolutions_data.is_end > 0 THEN "Окончено"
                    WHEN resolutions_data.is_stop > 0 THEN "Приостановлено"
                    WHEN resolutions_data.is_pending > 0 THEN "Отложено"
                    WHEN resolutions_data.is_terminate > 0 THEN "Прекращено"
                    ELSE "На исполнении"
                END
            `)).as("status_ip"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "arrest_sum"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "evaluation_sum"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "realization_property_sum"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "price_reduction_sum"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "realization_sum_2"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data"], "return_sum"))
            .select(db.ref(db.raw("IFNULL(debit_data.foreclose, 0.00)")).as("debitor"))
            .modify(query => {
                if ([ROLES.User, ROLES.Admin, ROLES.LimitedAdmin].includes(role))
                    query.select(db.ref(db.raw(`
                        CASE
                            WHEN review THEN "Получен ответ от ГМУ"
                            WHEN submission THEN "Отправлено"
                            ELSE ""
                        END
                    `)).as("interaction_gmu"))
                else if ([ROLES.GMULimitedAdmin, ROLES.GMUArkhangelsk].includes(role))
                    query.select(db.ref(db.raw(`
                        CASE
                            WHEN submission THEN "Получено сообщение от МИУДОЛ"
                            WHEN review THEN "Отправлено"
                            ELSE ""
                        END
                    `)).as("interaction_gmu"))
            })
            .leftJoin("debt_type", "debt_type.id", "meta.debt_type")
            .leftJoin(db.raw('(??) as resolutions_data', [subqueries.getResolutions]), 'meta.inn', 'resolutions_data.inn')
            .leftJoin(db.raw('(??) as transport_data', [subqueries.getActives("transport")]), 'meta.inn', 'transport_data.inn')
            .leftJoin(db.raw('(??) as nedvizh_data', [subqueries.getActives("property")]), 'meta.inn', 'nedvizh_data.inn')
            .leftJoin(db.raw('(??) as debit_data', [subqueries.getActives("debit")]), 'meta.inn', 'debit_data.inn')
            .leftJoin(db.raw('(??) as another_data', [subqueries.getActives("another")]), 'meta.inn', 'another_data.inn')
            .leftJoin(db.raw('(??) as interactions_data', [subqueries.getInteractionsGMU]), 'meta.inn', 'interactions_data.inn')
            .where({
                'meta.region': regionCode,
                'resolutions_data.is_derivative_debt': is_derivative_debt,
            })
            .modify(query => {
                is_archive
                    ? query.havingRaw(`COUNT(*) = SUM(CASE WHEN resolutions_data.is_archive = 1 THEN 1 ELSE 0 END)`)
                    : query.havingRaw(`SUM(CASE WHEN resolutions_data.is_archive = 0 THEN 1 ELSE 0 END) > 0`);
            })
            .groupBy('inn')
    },
    getInfo(inn) {
        return db('meta')
            .select(db.ref("meta.inn").as("inn"))
            .select(db.ref("meta.name").as("name"))
            .select(db.ref("debt_type.debt_type").as("category"))
            .select(db.ref("meta.kno").as("kno"))
            .select(db.ref("meta.sosp_code").as("sosp_code"))
            .leftJoin("debt_type", "debt_type.id", "meta.debt_type")
            .where("meta.inn", inn)
    },
    getResolutions(inn) {
        return db("resolutions")
            .select(db.ref("resolutions.post_number").as("resolutions_number"))
            .select(db.ref("resolutions.post_date").as("resolutions_date"))
            .select(db.ref("resolutions.post_sum").as("resolutions_sum"))
            .select(db.ref("resolutions.cur_debt").as("cur_debt"))
            .select(db.ref("resolutions.exec_number").as("exec_number"))
            .select(db.ref("resolutions.exec_date").as("exec_date"))
            .where("resolutions.inn", inn)
    },
    getActivesStatistics(inn) {
        return tableActives(inn, (query, nameActive) => {
            const cost = (nameActive === "debit")
                ? db.raw("IFNULL(total_sum, 0.00)")
                : db.raw("IFNULL(cost, 0.00)")

            query.count({ count: "id" }).sum({ cost })
        })
    },
    getDebt(inn) {
        return db("debit")
            .select("id")
            .select("date")
            .select("debitor_names")
            .select("debitor_inn")
            .select("total_sum")
            .where("inn", inn)
    },
    getActives(inn, nameActive) {
        if (nameActive === "transport")
            return subqueries
                .getActivesDetails("transport")
                .select({ number: "state_number" })
                .select("registration_start_date")
                .select("registration_end_date")
                .where("inn", inn)
                .andWhere("status", "<>", 2)
        else if (nameActive === "property")
            return subqueries
                .getActivesDetails("property")
                .select("share_size")
                .select("registration_start_date")
                .select("registration_end_date")
                .select({ number: "cadastral_number" })
                .where("inn", inn)
                .andWhere("status", "<>", 2)
                .andWhere("type_id", 2)
        else if (nameActive === "ground")
            return subqueries
                .getActivesDetails("property")
                .select("share_size")
                .select("registration_start_date")
                .select("registration_end_date")
                .select({ number: "cadastral_number" })
                .where("inn", inn)
                .andWhere("status", "<>", 2)
                .andWhere("type_id", 4)
        else if (nameActive === "debit")
            return subqueries.getActivesDetails("debit")
                .select("dz_foreclose_date")
                .select("dz_foreclose_sum")
                .select("dz_cancel_foreclose_date")
                .select("dz_cancel_foreclose_sum")
                .select("debitor_address")
                .where("inn", inn)
        else if (nameActive === "another")
            return subqueries
                .getActivesDetails("another")
                .where("inn", inn)
    }
}


const buildCommonFieldsQuery = async (
    withActives,
    withDebit,
    innList,
    isDerived,
    isArchive,
) => {
    const activesTables = ["transport", "property", "another"];
    const debitTable = "debit";

    const analyzedTables = [
        ...(withActives ? activesTables : []),
        ...(withDebit ? [debitTable] : [])
    ];

    const addActivesSum = query => {
        const getAlias = table => `${table}_actives_sum`;

        const buildSumSubquery = (table, alias) => {
            const targetField = table === debitTable ? "total_sum" : "cost";
            return db(table)
                .select("inn")
                .sumSafe(targetField, "sum_cost")
                .groupBy("inn")
                .as(alias)
        };

        const parts = [];
        analyzedTables.forEach(table => {
            const alias = getAlias(table);
            query.leftJoin(
                buildSumSubquery(table, alias),
                "meta.inn",
                alias + ".inn"
            );
            parts.push(`COALESCE(${alias}.sum_cost, 0)`);
        });

        const sumExpr = parts.length ? parts.join(" + ") : "0";
        query.select(db.raw(`(${sumExpr}) as actives_sum`));
    };

    const addIpProcessSums = query => {
        const getAlias = table =>  `${table}_ip_sum`;

        const totalSumName = "realization_sum_total";
        const activesFieldsToSum = [
            "arrest_sum",
            "evaluation_sum",
            "realization_sum_1",
            "price_reduction_sum",
            "realization_sum_2",
            "property_to_debtor_sum"
        ];

        const buildSumsSubquery = table => {
            const sumIpFields = activesFieldsToSum.map(
                field => db.raw(`SUM(${table}.${field}) AS ${field}`)
            );

            const totalRealisationSum = db.raw(`
                COALESCE(SUM(${table}.realization_sum_1), 0) +
                COALESCE(SUM(${table}.realization_sum_2), 0) AS ${totalSumName}
            `);

            return db(table)
                .select("inn")
                .groupBy("inn")
                .select(...sumIpFields, totalRealisationSum)
                .as(getAlias(table))
        };

        analyzedTables.forEach(table => {
            query.leftJoin(
                buildSumsSubquery(table),
                "meta.inn",
                `${getAlias(table)}.inn`
            );
        });

        const aliasedTables = analyzedTables.map(table => getAlias(table));

        [...activesFieldsToSum, totalSumName].forEach(field => {
            query.select(sumPrices(aliasedTables, field));
        });
    };

    const addIpStatus = query => {
        const flagsToStatusMap = {
            end_date:       "Окончено",
            stop_date:      "Приостановлено",
            pending_date:   "На рассмотрении",
            terminate_date: "Отложено",
            _:              "На исполнении",
        };
        query.reduceFlagsToStatusField("resolutions", "ip_status", flagsToStatusMap)
    };

    const addDebitSums = query => {
        if (!withDebit) return;

        const subquery = db("debit")
            .select("inn")
            .sumSafe("dz_foreclose_sum", "dz_sum")
            .sumSafe("dz_cancel_foreclose_sum", "dz_close_sum")
            .groupBy("inn")
            .as("debit_extra_sums")

        query
            .leftJoin(subquery, "meta.inn", "debit_extra_sums.inn")
            .select(
                db.raw("COALESCE(dz_sum, 0) as dz_sum"),
                db.raw("COALESCE(dz_close_sum, 0) as dz_close_sum")
            );
    };

    const addResolutionsSums = query => {
        query
            .sumSafe("resolutions.post_sum", "post_sum")
            .sumSafe("resolutions.cur_debt", "cur_debt")
            .leftJoin("resolutions", "meta.inn", "resolutions.inn")
    };

    const applyFilters = query => {
        if (innList?.length) {
            query.whereIn("meta.inn", innList);
            return;
        }
        query.where({ "resolutions.is_derivative_debt": isDerived });
        isArchive
            ? query.havingRaw(`COUNT(*) = SUM(CASE WHEN resolutions.is_archive = 1 THEN 1 ELSE 0 END)`)
            : query.havingRaw(`SUM(CASE WHEN resolutions.is_archive = 0 THEN 1 ELSE 0 END) > 0`);
    };

    const addDebtType = query => {
        query
            .select("debt_type.debt_type as debtor_category")
            .leftJoin("debt_type", "meta.debt_type", "debt_type.id")
    };

    const result = await db("meta")
        .select([
            "meta.kno as kno",
            "meta.inn as inn",
            "meta.name as name",
        ])
        .modify(getModifiersApply([
            addIpStatus,
            addDebtType,
            addResolutionsSums,
            addActivesSum,
            addIpProcessSums,
            addDebitSums,
            applyFilters,
        ]))
        .groupBy("meta.inn");

    for (const row of result) {
        row.securing_arrest = await securingArrest(row)
    }

    return result;
};


const getActivesDownloadingData = async ({
    inn,
    nameActive,
    isDerivate = null,
    isArchive = null,
    isNotFnsLizing = null
}) => {
    const addActivesData = query => {
        const table  = nameActive === 'ground' ? 'property' : nameActive;
        const applyNotFnsLizingPage = isNotFnsLizing && table !== 'debit';

        const buildRealisationSumTotal = table => {
            return query =>
                query.select(db.raw(`
                    COALESCE(${table}.realization_sum_1, 0) +
                    COALESCE(${table}.realization_sum_2, 0) AS realisationSumTotal
                `));
        };

        const applyTextStatuses = query => {
            const queryName = "";
            query
                .mapStatusToTextField(queryName, "status", {
                    0: "Данные из АИС",
                    2: "Данные из ГМУ",
                    3: "Пара АИС-ГМУ",
                }, { newField: "statusName" });
        };

        const applyFilters = query => {
            query
                .where({
                    ...(inn ? { inn }: {}),
                    ...(applyNotFnsLizingPage ? { 'is_fns_lizing': 2 } : {}),
                })
                .whereNotNull('status');
        };

        const addActiveType = query => {
            query
                .select("types.name as category")
                .leftJoin("types", "type_id", "types.id");
        };

        const activesSubQuery = db(table)
            .select(table + ".*")
            .modify(getModifiersApply([
                applyTextStatuses,
                addActiveType,
                applyFilters,
                buildRealisationSumTotal(table)
            ]));

        const queryName = "activesSubQuery";
        query
            .innerJoin(
                activesSubQuery.as(queryName),
                'meta.inn', queryName + '.inn'
            )
            .select(`${queryName}.*`);
    };

    const addResolutionsData = query => {
        const applyFilters = query => {
            query.where({ 'is_derivative_debt': isDerivate });
            isArchive
                ? query.havingRaw(`COUNT(*) = SUM(CASE WHEN is_archive = 1 THEN 1 ELSE 0 END)`)
                : query.havingRaw(`SUM(CASE WHEN is_archive = 0 THEN 1 ELSE 0 END) > 0`);
        };

        const subResolutions = db('resolutions')
            .select('inn')
            .sumSafe("post_sum", "dz_sum")
            .sumSafe("cur_debt")
            .max('exec_date as max_exec_date')
            .modify(applyFilters)
            .groupBy('inn');

        const queryName = "resolutionsSubQuery";
        query
            .leftJoin(
                subResolutions.as(queryName),
                'meta.inn', queryName + '.inn'
            )
            .selectNullProtected(
                queryName + ".dz_sum",
                queryName + ".cur_debt",
                queryName + ".max_exec_date",
            );
    }

    const addDebtType = query => {
        query
            .select("debt_type.debt_type as debtor_category")
            .leftJoin("debt_type", "meta.debt_type", "debt_type.id")
    };

    const addIndicators = async rows => {
        for (const row of rows) {
            const execMinDate = new Date(await models.getExecMinDate(row.inn))
            Object.entries(indicatorsGetters).forEach(
                ([ nameIndicator, getterIndicator ]) => {
                    row[nameIndicator + "Status"] = String(getterIndicator(execMinDate, row));
                }
            )
        }
        return rows;
    };

    return db('meta')
        .select([
            'meta.region',
            'meta.kno',
            'meta.name as metaName',
            'meta.inn',
        ])
        .modify(getModifiersApply([
            addActivesData,
            addResolutionsData,
            addDebtType,
        ]))
        .then(async result => await addIndicators(result));
};



export const download = {
    getStatistics: async (innList, isDerived, isArchive) => {
        const makeQuery = (withActives, withDebit) => buildCommonFieldsQuery(
            withActives, withDebit,
            innList, isDerived, isArchive
        );

        const [general, actives, debit] = await Promise.all([
            makeQuery(true, true),
            makeQuery(true, false),
            makeQuery(false, true),
        ]);

        return { general, actives, debit };
    },
    getActivesStatistics: async (inn, isDerivate, isArchive, activeSheetConfigs, lizingKeyPostfix) => {
        const stats = {};

        for (const [ nameActive,  { withLizing } ]  of Object.entries(activeSheetConfigs)) {
            const props = { inn, nameActive,  isDerivate, isArchive } ;

            stats[nameActive] = await getActivesDownloadingData({
                ...props, isNotFnsLizing: false
            });

            if (withLizing) {
                stats[nameActive + lizingKeyPostfix] = await getActivesDownloadingData({
                    ...props, isNotFnsLizing: true
                });
            }
        }

        return stats;
    },
    getStatisticsIP(innList) {
        return db("meta")
            .select(db.ref("meta.kno").as("kno"))
            .select(db.ref("meta.inn").as("inn"))
            .select(db.ref("meta.name").as("name"))
            .select(db.ref("resolutions.post_number").as("post_number"))
            .select(db.ref("resolutions.post_date").as("post_date"))
            .select(db.ref("resolutions.post_sum").as("post_sum"))
            .select(db.ref("resolutions.cur_debt").as("cur_debt"))
            .select(db.ref("resolutions.exec_number").as("exec_number"))
            .select(db.ref("resolutions.exec_date").as("exec_date"))
            .select(db.ref(db.raw("IFNULL(resolutions.end_date, '')")).as("end_date"))
            .select(db.ref(db.raw("IFNULL(resolutions.end_reason, '')")).as("end_reason"))
            .select(db.ref(db.raw(`
            CASE
                WHEN resolutions.end_date IS NOT NULL THEN "Окончено"
                WHEN resolutions.stop_date IS NOT NULL THEN "Приостановлено"
                WHEN resolutions.pending_date IS NOT NULL THEN "Отложено"
                WHEN resolutions.terminate_date IS NOT NULL THEN "Прекращено"
                ELSE "На исполнении"
            END
        `)).as("status_ip"))
            .leftJoin("resolutions", 'meta.inn', 'resolutions.inn')
            .whereIn("meta.inn", innList)
    },
}
