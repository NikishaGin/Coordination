const query =`
SELECT
    meta.inn,
    meta.kno,
    meta.name,
    resolutions.post_sum,
    resolutions.cur_debt,
    debt_type.debt_type,
    IFNULL(sum_transp, 0.00) + IFNULL(sum_nedv, 0.00) + IFNULL(sum_debit_dept, 0.00) + IFNULL(sum_another, 0.00) AS total,
    resolutions.is_end AS is_end,
    resolutions.is_stop AS is_stop,
    resolutions.is_pending AS is_pending,
    resolutions.is_terminate AS is_terminate,
    IFNULL(arrest_tr, 0.00) + IFNULL(arrest_nedv, 0.00) + IFNULL(arrest_debit, 0) + IFNULL(arrest_another, 0) AS arrest,
    IFNULL(evaluation_tr, 0.00) + IFNULL(evaluation_nedv, 0.00) + IFNULL(evaluation_debit, 0) + IFNULL(evaluation_another, 0) AS evaluation,
    IFNULL(realization_property_tr, 0.00) + IFNULL(realization_property_nedv, 0.00) + IFNULL(realization_property_debit, 0) + IFNULL(realization_property_another, 0) AS realization_property,
    IFNULL(price_reduction_tr, 0.00) + IFNULL(price_reduction_nedv, 0.00) + IFNULL(price_reduction_debit, 0) + IFNULL(price_reduction_another, 0) AS price_reduction,
    IFNULL(realization_sum_2_tr, 0.00) + IFNULL(realization_sum_2_nedv, 0.00) + IFNULL(realization_sum_2_debit, 0) + IFNULL(realization_sum_2_another, 0) AS realization_sum_2,
    IFNULL(return_sum_tr, 0.00) + IFNULL(return_sum_nedv, 0.00) + IFNULL(return_sum_debit, 0.00) AS return_sum,
    IFNULL(foreclose_debit, 0.00) AS debitor,
    IFNULL(is_fns_lizing_another, 0) + IFNULL(is_fns_lizing_transport, 0) + IFNULL(is_fns_lizing_nedv, 0) AS is_fns_lizing,
    GREATEST (IFNULL(transport.max_date, '0000-00-00'), IFNULL(nedvizh.max_date, '0000-00-00'), IFNULL(debit.max_date, '0000-00-00'), IFNULL(another.max_date, '0000-00-00')) AS max_load_date
FROM
    meta
LEFT JOIN (select inn, sum(post_sum) as post_sum, sum(cur_debt) as cur_debt, SUM(IF(end_date is NULL, 0, 1)) as is_end, SUM(IF(stop_date is NULL, 0, 1)) as is_stop ,SUM(IF(pending_date is NULL, 0, 1)) as is_pending, SUM(IF(terminate_date is NULL, 0, 1)) as is_terminate, sum(is_archive) as is_archive, sum(is_derivative_debt) as is_derivative_debt from resolutions group by inn) as resolutions ON meta.inn = resolutions.inn
LEFT JOIN (SELECT
        inn,
        sum(cost) AS sum_transp,
        SUM(IF(proceeding_end_date is not null, 1, 0)) as sum_end_tr,
        SUM(IF(proceeding_stop_date is not null, 1, 0)) as sum_stop_tr, 
        SUM(IF(proceeding_pending_date is not null, 1, 0)) as sum_pending_tr,
        SUM(IF(proceeding_terminate_date is not null, 1, 0)) as sum_terminate_tr,
        SUM(IF(is_fns_lizing = 1, 1, 0)) AS is_fns_lizing_transport,
        SUM(IFNULL(arrest_sum, 0.00)) as arrest_tr,
        SUM(IFNULL(evaluation_sum, 0.00)) as evaluation_tr,
        SUM(IFNULL(realization_property_sum, 0.00)) as realization_property_tr,
        SUM(IFNULL(price_reduction_sum, 0.00)) as price_reduction_tr,
        SUM(IFNULL(realization_sum_2, 0.00)) as realization_sum_2_tr,
        SUM(IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)) as return_sum_tr,
        MAX(load_date) as max_date
    FROM transport WHERE status != 2 group by inn) AS transport ON meta.inn = transport.inn
LEFT JOIN debt_type ON debt_type.id = meta.debt_type
LEFT JOIN (SELECT
        inn, 
        sum(cost) AS sum_nedv,
        SUM(IF(proceeding_end_date is not null, 1, 0)) as sum_end_nedv,
        SUM(IF(proceeding_stop_date is not null, 1, 0)) as sum_stop_nedv, 
        SUM(IF(proceeding_pending_date is not null, 1, 0)) as sum_pending_nedv,
        SUM(IF(proceeding_terminate_date is not null, 1, 0)) as sum_terminate_nedv,
        SUM(IF(is_fns_lizing = 1, 1, 0)) AS is_fns_lizing_nedv,
        SUM(IFNULL(arrest_sum, 0.00)) as arrest_nedv,
        SUM(IFNULL(evaluation_sum, 0.00)) as evaluation_nedv,
        SUM(IFNULL(realization_property_sum, 0.00)) as realization_property_nedv,
        SUM(IFNULL(price_reduction_sum, 0.00)) as price_reduction_nedv,
        SUM(IFNULL(realization_sum_2, 0.00)) as realization_sum_2_nedv,
        SUM(IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)) as return_sum_nedv,
        MAX(load_date) as max_date
    FROM property WHERE status != 2 group by inn) AS nedvizh ON meta.inn = nedvizh.inn
LEFT JOIN (SELECT
        inn, 
        sum(total_sum) AS sum_debit_dept,
        SUM(IF(proceeeding_end_date is not null, 1, 0)) as sum_end_debit,
        SUM(IF(proceeding_stop_date is not null, 1, 0)) as sum_stop_debit, 
        SUM(IF(proceeding_pending_date is not null, 1, 0)) as sum_pending_debit,
        SUM(IF(proceeding_terminate_date is not null, 1, 0)) as sum_terminate_debit,
        SUM(IFNULL(arrest_sum, 0.00)) as arrest_debit,
        SUM(IFNULL(evaluation_sum, 0.00)) as evaluation_debit,
        SUM(IFNULL(realization_property_sum, 0.00)) as realization_property_debit,
        SUM(IFNULL(price_reduction_sum, 0.00)) as price_reduction_debit,
        SUM(IFNULL(realization_sum_2, 0.00)) as realization_sum_2_debit,
        SUM(IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)) as return_sum_debit,
        SUM(IF(dz_foreclose_date IS NOT NULL, IFNULL(dz_foreclose_sum, 0.00), 0.00)) as foreclose_debit,
        MAX(load_date) as max_date
    FROM debit group by inn) AS debit ON meta.inn = debit.inn
LEFT JOIN (SELECT
        inn, 
        sum(cost) AS sum_another,
        SUM(IF(is_fns_lizing = 1, 1, 0)) AS is_fns_lizing_another,
        SUM(IFNULL(arrest_sum, 0.00)) as arrest_another,
        SUM(IFNULL(evaluation_sum, 0.00)) as evaluation_another,
        SUM(IFNULL(realization_property_sum, 0.00)) as realization_property_another,
        SUM(IFNULL(price_reduction_sum, 0.00)) as price_reduction_another,
        SUM(IFNULL(realization_sum_2, 0.00)) as realization_sum_2_another,
        MAX(load_date) as max_date
    FROM another group by inn) AS another ON meta.inn = another.inn
WHERE 
    meta.region = ?
AND
    resolutions.is_derivative_debt = 0
AND
    resolutions.is_archive >= 1
group by meta.inn
`

export default query