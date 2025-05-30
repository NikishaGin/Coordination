import db from "../connection.js"
import * as subqueries from "./subqueries.js"
import { ACTIVES } from "../types.js"



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




export const service = {
    async getUser(login) {
        return await db("users").select([
            "id",
            db.ref("password").as("passwordHash"),
            db.ref("name").as("firstname"),
            db.ref("surname").as("secondname"),
            db.ref("patronymic").as("lastname"),
            db.ref("region").as("regionCode"),
            "role"
        ])
            .where({ username: login })
    },

    checkServiceMode() {
        return db("settings").first("value")
    },

    async changeServiceMode() {
        const currValue = await db("settings").first("value")
        return await db("settings").update({ value: !currValue.value })
    },

    getRegions(is_derivative_debt, is_archive) {
        const query = db('meta')
            .select(db.raw('DISTINCT meta.region AS regionCode'), 'regions.regionName AS regionName')
            .leftJoin('resolutions', 'meta.inn', 'resolutions.inn')
            .leftJoin('regions', db.raw('meta.region COLLATE utf8mb4_general_ci = regions.regionCode'))
            .where({
                'resolutions.is_derivative_debt': is_derivative_debt,
                'resolutions.is_archive': is_archive
            })
            .orderBy('meta.region', 'asc')

        // console.log(query.toString())


        return query
    },

    getDebtTypes() {
        return db("debt_type").select("debt_type");
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
            // .select(db.ref(db.raw( )).as("indicators"))
            .leftJoin("debt_type", "debt_type.id", "meta.debt_type")
            .leftJoin(db.raw('(??) as resolutions_data', [subqueries.getResolutions]), 'meta.inn', 'resolutions_data.inn')
            .leftJoin(db.raw('(??) as transport_data', [subqueries.getActives("transport")]), 'meta.inn', 'transport_data.inn')
            .leftJoin(db.raw('(??) as nedvizh_data', [subqueries.getActives("property")]), 'meta.inn', 'nedvizh_data.inn')
            .leftJoin(db.raw('(??) as debit_data', [subqueries.getActives("debit")]), 'meta.inn', 'debit_data.inn')
            .leftJoin(db.raw('(??) as another_data', [subqueries.getActives("another")]), 'meta.inn', 'another_data.inn')
            .where({
                'meta.region': regionCode,
                'resolutions_data.is_derivative_debt': is_derivative_debt,
                'resolutions_data.is_archive': is_archive
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




    getActives(inn, nameActive, modifyFunc=() => undefined) {
        const tableName = (nameActive === "ground") ? "property" : nameActive
        db.modify(modifyFunc).from(function () {
            this
                .from(tableName)
                .select([
                    "id", "is_verified", "obj_status", "obj_status_manual",
                    "arrest_propperty", "arrest_sum", "wanted_open", "wanted_close", "wanted_result",
                    "evaluation_submit", "evaluation_accept", "evaluation_sum",
                    "realization_submit", "realization_sum_1", "realization_date_1", "realization_result_1",
                    "realization_property_sum" , "not_realization_notification", "price_reduction_resolution",
                    "price_reduction_sum", "realization_sum_2", "not_realization_notification_2", "realization_date_2",
                    "realization_result_2", "property_to_debtor_act", "property_to_debtor_sum", "comment"
                ])
                .modify(query => {
                    if (tableName !== "debit")
                        query.select(["name", "cost", "lizing_name", "is_fns_lizing", "encumbrance_type", "encumbrance_date"])
                    else
                        query
                            .select({ name: "debitor_names" })
                            .select({ cost: "total_sum" })
                            .select("date")
                })
        })


        /*
        if (nameActive === "transport")
            return subqueries
                .getActivesDetails("transport")
                .select({ number: "state_number" })
                .where("inn", inn)
                .andWhere("status", "<>", 2)
                .modify(modifyFunc)
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
                .modify(modifyFunc)
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
                .modify(modifyFunc)
        else if (nameActive === "debit")
            return subqueries.getActivesDetails("debit")
                .select("dz_foreclose_date")
                .select("dz_foreclose_sum")
                .select("dz_cancel_foreclose_date")
                .select("dz_cancel_foreclose_sum")
                .select("debitor_address")
                .where("inn", inn)
                .modify(modifyFunc)
        else if (nameActive === "another")
            return subqueries
                .getActivesDetails("another")
                .where("inn", inn)
                .modify(modifyFunc)

         */
    }
}


const buildCommonFieldsQuery = (withActives=true, withDebit=true, regionCode, innList) => {
    const tables = [
        ...(withActives ? [
            ACTIVES.Transport,
            "property",
            ACTIVES.Another
        ] : []),
        ...(withDebit ? [ACTIVES.Debit] : [])
    ].map(table => table.toLowerCase());

    const activesFieldsToSum = [
        "arrest_sum",
        "evaluation_sum",
        "realization_property_sum",
        "price_reduction_sum",
        "realization_sum_2",
        "property_to_debtor_sum"
    ];

     return db("meta")
        .select([
            "meta.kno as kno",
            "meta.inn as inn",
            "meta.name as name",
            "resolutions.post_sum as post_sum",
            "resolutions.cur_debt as cur_debt"
        ])
        .modify(query => {
            ["resolutions", "transport", "debit", "property", "another"].forEach(table =>
                query.leftJoin(table, "meta.inn", `${table}.inn`)
            );
        })
        .modify(query => {
            activesFieldsToSum.forEach(field => {
                query.sumFieldsOfFewTables(tables, field); // предполагается, что тут тоже alias'ы
            });
        })
         .groupBy("meta.inn")
        .whereIn("meta.inn", innList)
        .andWhere("meta.region", regionCode);
};


export const download = {
    getStatistics: async (regionCode, innList, isDerived) => {
        return {
            general: await buildCommonFieldsQuery(true, true, regionCode, innList),
            actives: await buildCommonFieldsQuery(true, false, regionCode, innList),
            debit: await buildCommonFieldsQuery(false, true, regionCode, innList),
        };
    },
    getStatisticsIP(regionCode, innList) {
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
            .andWhere("meta.region", regionCode)
    }
}


export const fileStorage = {
    getDocuments: (source) => {
        return db("library").select("*").where({ source })
    },
    saveDocument: (data) => {
        return db("library").insert(data)
    }
}