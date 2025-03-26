const query =`
WITH resolutions_data AS (
    SELECT
        inn,
        SUM(IFNULL(post_sum, 0.00)) AS post_sum,
        SUM(IFNULL(cur_debt, 0.00)) AS cur_debt,
        SUM(IF(end_date IS NULL, 0, 1)) AS is_end,
        SUM(IF(stop_date IS NULL, 0, 1)) AS is_stop,
        SUM(IF(pending_date IS NULL, 0, 1)) AS is_pending,
        SUM(IF(terminate_date IS NULL, 0, 1)) AS is_terminate,
        SUM(is_archive) AS is_archive,
        SUM(is_derivative_debt) AS is_derivative_debt
    FROM resolutions
    GROUP BY inn
),

transport_data AS (
    SELECT
        inn,
        SUM(IFNULL(cost, 0.00)) AS total_sum,
        SUM(IFNULL(arrest_sum, 0.00)) AS arrest,
        SUM(IFNULL(evaluation_sum, 0.00)) AS evaluation,
        SUM(IFNULL(realization_sum_1, 0.00)) AS realization_property,
        SUM(IFNULL(price_reduction_sum, 0.00)) AS price_reduction,
        SUM(IFNULL(realization_sum_2, 0.00)) AS realization_sum_2,
        SUM(IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)) AS return_sum
    FROM transport
    WHERE status != 2 
    GROUP BY inn
),

nedvizh_data AS (
    SELECT
        inn, 
        SUM(IFNULL(cost, 0.00)) AS total_sum,
        SUM(IFNULL(arrest_sum, 0.00)) AS arrest,
        SUM(IFNULL(evaluation_sum, 0.00)) AS evaluation,
        SUM(IFNULL(realization_sum_1, 0.00)) AS realization_property,
        SUM(IFNULL(price_reduction_sum, 0.00)) AS price_reduction,
        SUM(IFNULL(realization_sum_2, 0.00)) AS realization_sum_2,
        SUM(IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)) AS return_sum
    FROM property
    WHERE status != 2
    GROUP BY inn
),

debit_data AS (
    SELECT
        inn, 
        SUM(IFNULL(total_sum, 0.00)) AS total_sum,
        SUM(IFNULL(arrest_sum, 0.00)) AS arrest,
        SUM(IFNULL(evaluation_sum, 0.00)) AS evaluation,
        SUM(IFNULL(realization_sum_1, 0.00)) AS realization_property,
        SUM(IFNULL(price_reduction_sum, 0.00)) AS price_reduction,
        SUM(IFNULL(realization_sum_2, 0.00)) AS realization_sum_2,
        SUM(IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)) AS return_sum,
        SUM(IF(dz_foreclose_date IS NOT NULL, IFNULL(dz_foreclose_sum, 0.00), 0.00)) AS foreclose
    FROM debit
    GROUP BY inn
),

another_data AS (
    SELECT
        inn, 
        SUM(IFNULL(cost, 0.00)) AS total_sum,
        SUM(IFNULL(arrest_sum, 0.00)) AS arrest,
        SUM(IFNULL(evaluation_sum, 0.00)) AS evaluation,
        SUM(IFNULL(realization_sum_1, 0.00)) AS realization_property,
        SUM(IFNULL(price_reduction_sum, 0.00)) AS price_reduction,
        SUM(IFNULL(realization_sum_2, 0.00)) AS realization_sum_2
    FROM another
    GROUP BY inn
)


SELECT
    meta.inn AS inn,
    meta.name AS name,
    debt_type.debt_type AS category,
    meta.sosp_code AS sosp_code,
    resolutions_data.post_sum AS post_sum,
    resolutions_data.cur_debt AS cur_debt,
    (IFNULL(transport_data.total_sum, 0.00) + IFNULL(nedvizh_data.total_sum, 0.00) + IFNULL(debit_data.total_sum, 0.00) + IFNULL(another_data.total_sum, 0.00)) AS total_sum,
    CASE
        WHEN resolutions_data.is_end > 0 THEN "Окончено"
        WHEN resolutions_data.is_stop > 0 THEN "Приостановлено"
        WHEN resolutions_data.is_pending > 0 THEN "Отложено"
        WHEN resolutions_data.is_terminate > 0 THEN "Прекращено"
        ELSE "На исполнении"
    END AS status_ip,
    (IFNULL(transport_data.arrest, 0.00) + IFNULL(nedvizh_data.arrest, 0.00) + IFNULL(debit_data.arrest, 0.00) + IFNULL(another_data.arrest, 0.00)) AS arrest,
    (IFNULL(transport_data.evaluation, 0.00) + IFNULL(nedvizh_data.evaluation, 0.00) + IFNULL(debit_data.evaluation, 0.00) + IFNULL(another_data.evaluation, 0.00)) AS evaluation,
    (IFNULL(transport_data.realization_property, 0.00) + IFNULL(nedvizh_data.realization_property, 0.00) + IFNULL(debit_data.realization_property, 0.00) + IFNULL(another_data.realization_property, 0.00)) AS realization_property,
    (IFNULL(transport_data.price_reduction, 0.00) + IFNULL(nedvizh_data.price_reduction, 0.00) + IFNULL(debit_data.price_reduction, 0.00) + IFNULL(another_data.price_reduction, 0.00)) AS price_reduction,
    (IFNULL(transport_data.realization_sum_2, 0.00) + IFNULL(nedvizh_data.realization_sum_2, 0.00) + IFNULL(debit_data.realization_sum_2, 0) + IFNULL(another_data.realization_sum_2, 0)) AS realization_sum_2,
    (IFNULL(transport_data.return_sum, 0.00) + IFNULL(nedvizh_data.return_sum, 0.00) + IFNULL(debit_data.return_sum, 0.00)) AS return_sum,
    IFNULL(debit_data.foreclose, 0.00) AS debitor
FROM meta
LEFT JOIN debt_type ON debt_type.id = meta.debt_type
LEFT JOIN resolutions_data ON meta.inn = resolutions_data.inn
LEFT JOIN transport_data ON meta.inn = transport_data.inn
LEFT JOIN nedvizh_data ON meta.inn = nedvizh_data.inn
LEFT JOIN debit_data ON meta.inn = debit_data.inn
LEFT JOIN another_data ON meta.inn = another_data.inn
WHERE 
    meta.region = ?
AND
    resolutions_data.is_derivative_debt = 0
AND
    resolutions_data.is_archive = 0
GROUP BY inn
`

export default query