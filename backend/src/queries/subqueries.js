import db from "../connection.js"


export const getResolutions = (is_derivative_debt, is_archive, {selectSumData = true} = {}) => {
    return db('resolutions')
        .select('inn')
        .modify(query => {
            if (selectSumData)
                query
                    .sum({post_sum: db.raw('IFNULL(post_sum, 0.00)')})
                    .sum({cur_debt: db.raw('IFNULL(cur_debt, 0.00)')})
                    .sum({is_end: db.raw('IF(end_date IS NULL, 0, 1)')})
                    .sum({is_stop: db.raw('IF(stop_date IS NULL, 0, 1)')})
                    .sum({is_pending: db.raw('IF(pending_date IS NULL, 0, 1)')})
                    .sum({is_terminate: db.raw('IF(terminate_date IS NULL, 0, 1)')})
                    .max({max_exec_date: 'exec_date'})


            if (is_derivative_debt)
                query.select(db.ref(db.raw("MAX(resolutions.is_derivative_debt)")).as("isDerived"))
            else
                query.select(db.ref(db.raw("MIN(resolutions.is_derivative_debt)")).as("isDerived"))
            query.select(db.ref(db.raw("MIN(resolutions.is_archive OR (resolutions.end_date IS NOT NULL) OR (resolutions.terminate_date IS NOT NULL))")).as("isArchive"))
            query.havingRaw("(isDerived = ?) AND (isArchive = ?)", [+is_derivative_debt, +is_archive])




        })
        .groupBy('inn')
}


export function getActives(tableName) {
    let query = db(tableName)
        .select('inn')
        .sum({total_sum: db.raw(`IFNULL(${tableName === "debit" ? 'total_sum' : 'cost'}, 0.00)`)})
        .sum({arrest_sum: db.raw('IFNULL(arrest_sum, 0.00)')})
        .sum({evaluation_sum: db.raw('IFNULL(evaluation_sum, 0.00)')})
        .sum({realization_property_sum: db.raw('IFNULL(realization_property_sum, 0.00)')})
        .sum({price_reduction_sum: db.raw('IFNULL(price_reduction_sum, 0.00)')})
        .sum({realization_sum_2: db.raw('IFNULL(realization_sum_2, 0.00)')})
        .sum({return_sum: db.raw('IFNULL(property_to_debtor_sum, 0.00)')})
    if (tableName == "debit")
        query = query.sum({foreclose: db.raw('IFNULL(dz_foreclose_sum, 0.00)')})
    if (["transport", "property"].includes(tableName))
        query = query.where("status", "<>", 2)
    query = query.groupBy('inn')
    return query
}


export const getInteractionsGMU = db("interactions")
    .select('inn')
    .select(db.ref(db.raw("SUM(IF(((submissionDate IS NULL) OR (originalFilename_1 IS NULL)), 0, 1)) > 0")).as("submission"))
    .select(db.ref(db.raw("SUM(IF(((reviewDate IS NULL) OR (result IS NULL) OR (originalFilename_2 IS NULL)), 0, 1)) > 0")).as("review"))
    .where({source: "gmu"})
    .groupBy('inn')


export function getActivesDetails(tableName) {
    let query = db(tableName)
        .select("id")
        .select("is_verified")
        .select("obj_status")
        .select("obj_status_manual")
        .select("arrest_propperty")
        .select("arrest_sum")
        .select("arrest_end_date")
        .select("arrest_end_cause")
        .select("person_filed_complaint")
        .select("complaint_date")
        .select("complaint_subject")
        .select("complaint_source")
        .select("complaint_result")
        .select("wanted_open")
        .select("wanted_close")
        .select("wanted_result")
        .select("evaluation_submit")
        .select("evaluation_accept")
        .select("evaluation_sum")
        .select("realization_submit")
        .select("realization_sum_1")
        .select("realization_date_1")
        .select("realization_result_1")
        .select("realization_property_sum")
        .select("not_realization_notification")
        .select("realisation1_failure_reason")
        .select("price_reduction_resolution")
        .select("price_reduction_sum")
        .select("realization_sum_2")
        .select("not_realization_notification_2")
        .select("realisation2_failure_reason")
        .select("realization_date_2")
        .select("realization_result_2")
        .select("property_to_debtor_act")
        .select("property_to_debtor_sum")
        .select("comment")
    if (tableName != "debit")
        query = query
            .select("name")
            .select("cost")
            .select("lizing_name")
            .select("is_fns_lizing")
            .select("encumbrance_type")
            .select("encumbrance_date")
    else
        query = query
            .select("debitor_inn")
            .select({name: "debitor_names"})
            .select({cost: "total_sum"})
            .select("date")
    return query
}