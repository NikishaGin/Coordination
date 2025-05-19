import db from "../connection.js"
import * as subqueries from "./subqueries.js"
import { ACTIVES } from "../../types.js"



const sumPrices = (tableNames, field) => db.ref(db.raw(tableNames.map(table => `IFNULL(${table}.${field}, 0.00)`).join(" + "))).as(field)



export const service = {
    getRegions(is_derivative_debt, is_archive) {
        return db('meta')
            .select(db.raw('DISTINCT meta.region AS regionCode'), 'regions.regionName AS regionName')
            .leftJoin('resolutions', 'meta.inn', 'resolutions.inn')
            .leftJoin('regions', db.raw('meta.region COLLATE utf8mb4_general_ci = regions.regionCode'))
            .where({
                'resolutions.is_derivative_debt': is_derivative_debt,
                'resolutions.is_archive': is_archive
            })
            .orderBy('meta.region', 'asc')
    },

    getDebtTypes() {
        return db("debt_type").select("debt_type");
    },

    checkServiceMode() {
        return db("settings").first("value")
    },

    async changeServiceMode() {
        let currValue = await db("settings").first("value")
        console.log(currValue)
        return await db("settings").update({
            value: !currValue.value
        })
    }
}


export const actives = {
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
        const result = {
            transport: db("transport").count({ count: "id" }).sum({ cost: db.raw("IFNULL(cost, 0.00)") }).where("inn", inn).andWhere("status", "<>", 2),
            property: db("property").count({ count: "id" }).sum({ cost: db.raw("IFNULL(cost, 0.00)") }).where("inn", inn).andWhere("status", "<>", 2).andWhere("type_id", 2),
            ground: db("property").count({ count: "id" }).sum({ cost: db.raw("IFNULL(cost, 0.00)") }).where("inn", inn).andWhere("status", "<>", 2).andWhere("type_id", 4),
            debit: db("debit").count({ count: "id" }).sum({ cost: db.raw("IFNULL(total_sum, 0.00)") }).where("inn", inn),
            another: db("another").count({ count: "id" }).sum({ cost: db.raw("IFNULL(cost, 0.00)") }).where("inn", inn)
        }
        return result
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


const buildCommonFieldsQuery = (
    withActives = true,
    withDebit = true,
    regionCode,
    innList
) => {
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