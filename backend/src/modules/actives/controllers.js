import db from "../../connection.js"
import { resolutions, actives } from "./subqueries.js"



export function getTables(request, response) {
    const page = request.params.page
    const regionCode = request.params.regionCode
    const sumPrices = (tableNames, field) => tableNames.map(table => `IFNULL(${table}.${field}, 0.00)`).join(" + ")
    db('meta')
        .select(db.ref("meta.inn").as("inn"))
        .select(db.ref("meta.name").as("name"))
        .select(db.ref("debt_type.debt_type").as("category"))
        .select(db.ref("meta.sosp_code").as("sosp_code"))
        .select(db.ref("resolutions_data.post_sum").as("post_sum"))
        .select(db.ref("resolutions_data.cur_debt").as("cur_debt"))
        .select(db.ref(db.raw(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "total_sum"))).as("total_sum"))
        .select(db.ref(db.raw(`
            CASE
                WHEN resolutions_data.is_end > 0 THEN "Окончено"
                WHEN resolutions_data.is_stop > 0 THEN "Приостановлено"
                WHEN resolutions_data.is_pending > 0 THEN "Отложено"
                WHEN resolutions_data.is_terminate > 0 THEN "Прекращено"
                ELSE "На исполнении"
            END
        `)).as("status_ip"))
        .select(db.ref(db.raw(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "arrest"))).as("arrest"))
        .select(db.ref(db.raw(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "evaluation"))).as("evaluation"))
        .select(db.ref(db.raw(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "realization_property"))).as("realization_property"))
        .select(db.ref(db.raw(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "price_reduction"))).as("price_reduction"))
        .select(db.ref(db.raw(sumPrices(["transport_data", "nedvizh_data", "debit_data", "another_data"], "realization_sum_2"))).as("realization_sum_2"))
        .select(db.ref(db.raw(sumPrices(["transport_data", "nedvizh_data", "debit_data"], "return_sum"))).as("return_sum"))
        .select(db.ref(db.raw("IFNULL(debit_data.foreclose, 0.00)")).as("debitor"))
        // .select(db.ref(db.raw( )).as("indicators"))
        .leftJoin("debt_type", "debt_type.id", "meta.debt_type")
        .leftJoin(db.raw('(??) as resolutions_data', [resolutions]), 'meta.inn', 'resolutions_data.inn')
        .leftJoin(db.raw('(??) as transport_data', [actives("transport")]), 'meta.inn', 'transport_data.inn')
        .leftJoin(db.raw('(??) as nedvizh_data', [actives("property")]), 'meta.inn', 'nedvizh_data.inn')
        .leftJoin(db.raw('(??) as debit_data', [actives("debit")]), 'meta.inn', 'debit_data.inn')
        .leftJoin(db.raw('(??) as another_data', [actives("another")]), 'meta.inn', 'another_data.inn')
        .where({
            'meta.region': regionCode,
            'resolutions_data.is_derivative_debt': +((page === "DerivativeDebt") || (page === "DerivativeDebtArchive")),
            'resolutions_data.is_archive': +((page === "IndexArchive") || (page === "DerivativeDebtArchive"))
        })
        .groupBy('inn')
        .then(data => response.end(JSON.stringify(data)))
        .catch(console.log)    
}


export function getInfo(request, response) {
    const inn = request.params.inn
    
}


export function getActives(request, response) {
    const inn = request.params.inn
    db("meta")
        .select(["kno", db.ref("debt_type.debt_type").as("category")])
        .leftJoin("debt_type", "debt_type.id", "meta.debt_type")
        .where({ inn })
        .then(data => response.end(JSON.stringify(data[0])))
        .catch(console.log)    



    /*
    SELECT 
        inn,
        kno,
        dt.debt_type as type
    FROM 
        meta
    LEFT JOIN debt_type as dt ON meta.debt_type = dt.id
    WHERE
        inn = ?s
    */
}