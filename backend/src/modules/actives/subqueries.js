import db from "../../connection.js"


export const resolutions = db('resolutions')
    .select('inn')
    .sum({ post_sum: db.raw('IFNULL(post_sum, 0.00)') })
    .sum({ cur_debt: db.raw('IFNULL(cur_debt, 0.00)') })
    .sum({ is_end: db.raw('IF(end_date IS NULL, 0, 1)') })
    .sum({ is_stop: db.raw('IF(stop_date IS NULL, 0, 1)') })
    .sum({ is_pending: db.raw('IF(pending_date IS NULL, 0, 1)') })
    .sum({ is_terminate: db.raw('IF(terminate_date IS NULL, 0, 1)') })
    .sum({ is_archive: 'is_archive' })
    .sum({ is_derivative_debt: 'is_derivative_debt' })
    .max({ max_exec_date: 'exec_date' })
    .groupBy('inn')


export function actives(tableName) {
    let query = db(tableName)
        .select('inn')
        .sum({ total_sum: ((tableName === "debit") ? db.raw('IFNULL(total_sum, 0.00)') : db.raw('IFNULL(cost, 0.00)')) })
        .sum({ arrest: db.raw('IFNULL(arrest_sum, 0.00)') })
        .sum({ evaluation: db.raw('IFNULL(evaluation_sum, 0.00)') })
        .sum({ realization_property: db.raw('IFNULL(realization_sum_1, 0.00)') })
        .sum({ price_reduction: db.raw('IFNULL(price_reduction_sum, 0.00)') })
        .sum({ realization_sum_2: db.raw('IFNULL(realization_sum_2, 0.00)') })
    if (tableName != "another")
        query = query.sum({ return_sum: db.raw('IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)') })
    if (tableName == "debit")
        query = query.sum({ foreclose: db.raw('IF(dz_foreclose_date IS NOT NULL, IFNULL(dz_foreclose_sum, 0.00), 0.00)') })
    if (["transport", "property"].includes(tableName))
        query = query.where("status", "<>", 2)
    query = query.groupBy('inn')
    return query
}




