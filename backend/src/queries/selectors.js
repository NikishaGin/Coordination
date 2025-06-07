import db from "../connection.js"
import * as subqueries from "./subqueries.js"



const sumPrices = (tableNames, field) => db.ref(db.raw(tableNames.map(table => `IFNULL(${table}.${field}, 0.00)`).join(" + "))).as(field)

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
    async getExecMinDate(inn) {
        const [{ execMinDate }] = await db("resolutions").min("exec_date as execMinDate").where({ inn })
        return execMinDate
    },
    async getMaxLoadDate(inn) {
        const datesArr = await tableActives(inn, query => query.max("load_date as maxLoadDate"))

        const entries = Object.entries(datesArr)
        const listDates = entries.map(([_, data]) => new Date(data[0].maxLoadDate ?? 0))

        return Math.max(...listDates)
    },
    async isLizingFNS(inn) {
        const modify = (query, name) => {
            return name !== "debit"
                ? query.where({ is_fns_lizing: 1}).first("id as exists")
                : query.whereRaw("false")
        }
        return await tableActives(inn, modify).then(Boolean)
    },

    getTables(regionCode, is_derivative_debt, is_archive) {
        return db('meta')
            .select(db.ref("meta.inn").as("inn"))
            .select(db.ref("meta.name").as("name"))
            .select(db.ref("debt_type.debt_type").as("category"))
            .select(db.ref("meta.sosp_code").as("sosp_code"))
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
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "arrest"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "evaluation"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "realization_property"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "price_reduction"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "realization_sum_2"))
            .select(sumPrices(["transport_data", "nedvizh_data", "debit_data"], "return_sum"))
            .select(db.ref(db.raw("IFNULL(debit_data.foreclose, 0.00)")).as("debitor"))
            .leftJoin("debt_type", "debt_type.id", "meta.debt_type")
            .leftJoin(db.raw('(??) as resolutions_data', [subqueries.getResolutions]), 'meta.inn', 'resolutions_data.inn')
            .leftJoin(db.raw('(??) as transport_data', [subqueries.getActives("transport")]), 'meta.inn', 'transport_data.inn')
            .leftJoin(db.raw('(??) as nedvizh_data', [subqueries.getActives("property")]), 'meta.inn', 'nedvizh_data.inn')
            .leftJoin(db.raw('(??) as debit_data', [subqueries.getActives("debit")]), 'meta.inn', 'debit_data.inn')
            .leftJoin(db.raw('(??) as another_data', [subqueries.getActives("another")]), 'meta.inn', 'another_data.inn')
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
            const cost = (nameActive === "debit") ? db.raw("IFNULL(total_sum, 0.00)") : db.raw("IFNULL(cost, 0.00)")
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
    const activesFieldsToSum = [
        "arrest_sum",
        "evaluation_sum",
        "realization_property_sum",
        "price_reduction_sum",
        "realization_sum_2",
        "property_to_debtor_sum"
    ];

    const buildActivesSubquery = (table) => {
        return db(table)
            .select("inn")
            .groupBy("inn")
            .modify(q => {
                activesFieldsToSum.forEach(field => {
                    q.sum({ [`${field}_${table}`]: field });
                });
            });
    };

    // Построим список сабквери для активов
    const subqueries = {};

    if (withActives) {
        for (const table of ["transport", "property", "another"]) {
            subqueries[table] = buildActivesSubquery(table);
        }
    }

    if (withDebit) {
        subqueries["debit"] = buildActivesSubquery("debit");
    }

    const query = db("meta")
        .select([
            "meta.kno as kno",
            "meta.inn as inn",
            "meta.name as name",
            "resolutions.post_sum as post_sum",
            "resolutions.cur_debt as cur_debt"
        ])
        .leftJoin("resolutions", "meta.inn", "resolutions.inn");

    for (const [table, subq] of Object.entries(subqueries)) {
        query.leftJoin(
            db.from(subq.as(table)).as(table),
            "meta.inn",
            `${table}.inn`
        );
    }

    if (innList) {
        query.whereIn("meta.inn", innList);
    } else {
        query
            .where("resolutions.is_derivative_debt", isDerived)
            .where("resolutions.is_archive", isArchive)
    }

    query.groupBy("meta.inn");

    return query;
};


const getActivesDownloadingData = async ({
    inn,
    nameActive,
    isDerivate = null,
    isArchive = null,
    isNotFnsLizing = null
}) => {
    const table  = nameActive === 'ground' ? 'property' : nameActive;
    const active = db(table + " as t")
        .select('t.*')
        .whereNotNull('t.status')
        .modify(query => {
            if (inn) query.where({ inn });
            if (table !== 'debit' && isNotFnsLizing) {
                query.where('t.is_fns_lizing', 2)
            }
        })
        .mapStatusToTextField("t", "status", {
            0: "Данные из АИС",
            2: "Данные из ГМУ",
            3: "Пара АИС-ГМУ",
        }, { newField: "statusName"})
        .leftJoin("types as at", "type_id", "at.id")
        .select("at.name as category")


    const subResolutions = db('resolutions as res')
        .select('inn')
        .max('res.exec_date as max_exec_date')
        .sum('res.post_sum as post_sum')
        .sum('res.cur_debt as cur_debt')
        .where({
            'res.is_derivative_debt': isDerivate,
        })
        .modify(query => {
            isArchive
                ? query.havingRaw(`COUNT(*) = SUM(CASE WHEN res.is_archive = 1 THEN 1 ELSE 0 END)`)
                : query.havingRaw(`SUM(CASE WHEN res.is_archive = 0 THEN 1 ELSE 0 END) > 0`);
        })
        .groupBy('inn');


    const result = await db('meta')
        .select([
            'meta.region',
            'meta.kno',
            'meta.name as metaName',
            'meta.inn',
            'res.post_sum as post_sum',
            'res.cur_debt as cur_debt',
            'res.max_exec_date',
            'a.*',
        ])
        .innerJoin(active.as('a'), 'meta.inn', 'a.inn')
        .leftJoin("debt_type as dt", "meta.debt_type", "dt.id")
        .select("dt.debt_type as debtor_category")
        .leftJoin(subResolutions.as('res'), 'meta.inn', 'res.inn')


    return result;
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