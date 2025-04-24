import db from "../connection.js"
import * as subqueries from "./subqueries.js"



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
        return db("debt_type").select("*")
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
            realty: db("property").count({ count: "id" }).sum({ cost: db.raw("IFNULL(cost, 0.00)") }).where("inn", inn).andWhere("status", "<>", 2).andWhere("type_id", 2),
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







/*
SELECT 
    res.post_number,
    res.post_date,
    res.post_sum,
    res.cur_debt,
    res.exec_number,
    res.exec_date,
    (IFNULL(transport_recovered, 0.00) + IFNULL(property_recovered, 0.00)) AS total_recovered
FROM
    resolutions as res
LEFT JOIN (SELECT inn, post_number, SUM(recovered_total) AS transport_recovered FROM transport  WHERE status != 2 group by inn) AS transport ON res.inn = transport.inn AND res.post_number = transport.post_number
LEFT JOIN (SELECT inn, post_number, SUM(recovered_total) AS property_recovered FROM property WHERE status != 2  group by inn) AS property ON res.inn = property.inn AND res.post_number = property.post_number
where
    res.inn = ?
*/





export const download = {
    getStatistics(regionCode, innList) {





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