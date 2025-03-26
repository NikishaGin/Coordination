const query = {
    getRegions: "SELECT DISTINCT region AS regionCode FROM meta LEFT JOIN resolutions res ON meta.inn = res.inn WHERE res.is_derivative_debt = ? AND is_archive = ? ORDER BY region ASC",
    getRegionName: "SELECT regionName FROM regions WHERE regionCode = ?",
    getDebtTypes: "SELECT * FROM debt_type",
    getInfo: {
        dataRows: `
        SELECT
            meta.inn,
            meta.kno,
            meta.name,
            IFNULL(ddm.foreclose_salary_date, '-') AS salary_date,
            IFNULL(ddm.not_travel_date, '-') AS travel_date,
            debt_type.debt_type,
            IFNULL(sum_transp, 0.00) AS sum_transp,
            IFNULL(cnt_transp, 0) AS cnt_transp,
            IFNULL(sum_nedv, 0.00) AS sum_nedv,
            IFNULL(cnt_nedv, 0) AS cnt_nedv,
            IFNULL(sum_ground, 0.00) AS sum_ground,
            IFNULL(cnt_ground, 0) AS cnt_ground,
            IFNULL(sum_debit_dept, 0.00) AS debitor_dept,
            debit_count AS debitor_count,
            (IFNULL(sum_transp, 0.00) + IFNULL(sum_nedv, 0.00) + IFNULL(sum_debit_dept, 0.00)) AS total_sum,
            IFNULL(cnt_another, 0) AS cnt_another,
            IFNULL(sum_another, 0.00) AS sum_another
        FROM meta
        LEFT JOIN derivative_debt_meta AS ddm ON ddm.inn = meta.inn
        LEFT JOIN (SELECT inn, sum(cost) AS sum_transp, count(id) AS cnt_transp FROM transport WHERE status != 2 GROUP BY inn) AS transport ON meta.inn = transport.inn
        LEFT JOIN debt_type ON debt_type.id = meta.debt_type
        LEFT JOIN (SELECT inn, sum(cost) AS sum_nedv, count(id) AS cnt_nedv FROM property  WHERE status != 2 AND type_id = 2 GROUP BY inn) AS nedvizh ON meta.inn = nedvizh.inn
        LEFT JOIN (SELECT inn, sum(cost) AS sum_ground, count(id) AS cnt_ground FROM property  WHERE status != 2 AND type_id = 4 GROUP BY inn) AS ground ON meta.inn = ground.inn
        LEFT JOIN (SELECT inn, count(id) AS debit_count, sum(total_sum) AS sum_debit_dept FROM debit GROUP BY inn) AS debit ON meta.inn = debit.inn
        LEFT JOIN (SELECT inn, count(id) AS cnt_another, sum(cost) AS sum_another FROM another GROUP BY inn) AS another ON meta.inn = another.inn
        WHERE meta.inn = ?
        GROUP BY meta.inn
        `,
        resolutions: `
        SELECT 
            resolutions.post_number,
            resolutions.post_date,
            resolutions.post_sum,
            resolutions.cur_debt,
            resolutions.exec_number,
            resolutions.exec_date,
            (IFNULL(transport_recovered, 0.00) + IFNULL(property_recovered, 0.00)) AS total_recovered
        FROM resolutions
        LEFT JOIN (SELECT inn, post_number, SUM(recovered_total) AS transport_recovered FROM transport  WHERE status != 2 GROUP BY inn) AS transport ON resolutions.inn = transport.inn AND resolutions.post_number = transport.post_number
        LEFT JOIN (SELECT inn, post_number, SUM(recovered_total) AS property_recovered FROM property WHERE status != 2  GROUP BY inn) AS property ON resolutions.inn = property.inn AND resolutions.post_number = property.post_number
        WHERE resolutions.inn = ?
        `,
        salary: `SELECT * FROM derivative_debt_meta WHERE inn = ?`,
        depts: `
        SELECT 
            debit.id,
            debit.date,
            debit.debitor_names AS name,
            debit.debitor_inn AS inn_debit,
            debit.total_sum
        FROM debit
        WHERE debit.inn = ?
        `
    },
    getActives: {
        nedv: `
        SELECT * FROM (
            SELECT
                id,
                name,
                cadastral_number,
                cost,
                encumbrance_type,
                encumbrance_date,
                lizing_name,
                is_fns_lizing,
                arrest_propperty,
                arrest_sum,
                wanted_open,
                wanted_close,
                wanted_result,
                evaluation_accept,
                evaluation_sum,
                realization_submit,
                realization_property_sum,
                price_reduction_resolution,
                price_reduction_sum,
                realization_result_2,
                realization_sum_2,
                property_to_debtor_act,
                property_to_debtor_sum,
                share_size,
                comment,
                row_number() over (PARTITION BY inn ORDER BY cost DESC) AS num
            FROM property
            WHERE inn = ? AND type_id = 2 AND status != 2
        ) AS res
        WHERE res.num < 6
        ORDER BY res.num
        `,
        ground: `
        SELECT * FROM (
            SELECT
                id,
                name,
                cadastral_number,
                cost,
                encumbrance_type,
                encumbrance_date,
                lizing_name,
                is_fns_lizing,
                arrest_propperty,
                arrest_sum,
                wanted_open,
                wanted_close,
                wanted_result,
                evaluation_accept,
                evaluation_sum,
                realization_submit,
                realization_property_sum,
                price_reduction_resolution,
                price_reduction_sum,
                realization_result_2,
                realization_sum_2,
                property_to_debtor_act,
                property_to_debtor_sum,
                share_size,
                comment,
                row_number() over (PARTITION BY inn ORDER BY cost DESC) AS num
            FROM property
            WHERE inn = ? AND type_id = 4 AND status != 2
        ) AS res
        WHERE res.num < 6
        ORDER BY res.num
        `,
        transport: `
        SELECT * FROM (
            SELECT 
                id,
                name,
                state_number,
                cost,
                encumbrance_type,
                encumbrance_date,
                lizing_name,
                is_fns_lizing,
                arrest_propperty,
                arrest_sum,
                wanted_open,
                wanted_close,
                wanted_result,
                evaluation_accept,
                evaluation_sum,
                realization_submit,
                realization_property_sum,
                price_reduction_resolution,
                price_reduction_sum,
                realization_result_2,
                realization_sum_2,
                property_to_debtor_act,
                property_to_debtor_sum,
                comment,
                row_number() over (PARTITION BY inn ORDER BY cost DESC) AS num
            FROM transport
            WHERE inn = ? AND status != 2
        ) AS res
        WHERE res.num < 6
        ORDER BY res.num
        `,
        debit: `
        SELECT 
            id,
            debitor_names,
            date,
            total_sum as cost,
            arrest_propperty,
            arrest_sum,
            evaluation_accept,
            evaluation_sum,
            realization_submit,
            realization_property_sum,
            price_reduction_resolution,
            price_reduction_sum,
            realization_result_2,
            realization_sum_2,
            property_to_debtor_act,
            property_to_debtor_sum,
            dz_foreclose_date,
            dz_foreclose_sum,
            dz_cancel_foreclose_date,
            dz_cancel_foreclose_sum,
            comment
        FROM debit
        WHERE inn = ?
        `
    },
    getDetail: {
        dataRows: `
        SELECT
                meta.inn,
                meta.kno,
                meta.name,
                debt_type.debt_type,
                IFNULL(ddm.foreclose_salary_date, '-') AS salary_date,
                IFNULL(ddm.not_travel_date, '-') as travel_date,
                IFNULL(arrest_tr, 0.00) + IFNULL(arrest_nedv, 0.00) + IFNULL(arrest_another, 0.00) AS arrest,
                IFNULL(wanted_sum_tr, 0.00) + IFNULL(wanted_sum_nedv, 0.00) AS wanted,
                IFNULL(evaluation_tr, 0.00) + IFNULL(evaluation_nedv, 0.00) + IFNULL(evaluation_another, 0.00) AS evaluation,
                IFNULL(realization_property_tr, 0.00) + IFNULL(realization_property_nedv, 0.00) + IFNULL(realization_property_another, 0.00) AS realization_property,
                IFNULL(price_reduction_tr, 0.00) + IFNULL(price_reduction_nedv, 0.00) + IFNULL(price_reduction_another, 0.00) AS price_reduction,
                IFNULL(realization_sum_2_tr, 0.00) + IFNULL(realization_sum_2_nedv, 0.00) + IFNULL(realization_sum_2_another, 0.00) AS realization_sum_2,
                IFNULL(return_sum_tr, 0.00) + IFNULL(return_sum_nedv, 0.00) + IFNULL(return_sum_debit, 0.00) AS return_sum,
                IFNULL(arrest_debit, 0.00) AS debitor_arrest,
                IFNULL(evaluation_debit, 0.00)AS debitor_evaluation,
                IFNULL(realization_property_debit, 0.00) AS debitor_realization_property,
                IFNULL(price_reduction_debit, 0.00) AS debitor_price_reduction,
                IFNULL(realization_sum_2_debit, 0.00) AS debitor_realization_sum_2,
                IFNULL(foreclose_debit, 0.00) AS debitor,
                IFNULL(sum_transp, 0.00) + IFNULL(sum_nedv, 0.00) AS active,
                IFNULL(sum_debit_dept, 0.00) AS debitor_debt
            FROM
                meta
      
                  LEFT JOIN derivative_debt_meta as ddm ON ddm.inn = meta.inn
            LEFT JOIN (SELECT
                    inn,
                    sum(cost) AS sum_transp,
                    SUM(IF(wanted_open IS NOT NULL, cost, 0.00)) as wanted_sum_tr,
                    SUM(IFNULL(arrest_sum, 0.00)) as arrest_tr,
                    SUM(IFNULL(evaluation_sum, 0.00)) as evaluation_tr,
                    SUM(IFNULL(realization_property_sum, 0.00)) as realization_property_tr,
                    SUM(IFNULL(price_reduction_sum, 0.00)) as price_reduction_tr,
                    SUM(IFNULL(realization_sum_2, 0.00)) as realization_sum_2_tr,
                    SUM(IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)) as return_sum_tr
                FROM transport WHERE status != 2 group by inn) AS transport ON meta.inn = transport.inn
            LEFT JOIN debt_type ON debt_type.id = meta.debt_type
            LEFT JOIN (SELECT
                    inn, 
                    sum(cost) AS sum_nedv,
                    SUM(IF(wanted_open IS NOT NULL, cost, 0.00)) as wanted_sum_nedv,
                    SUM(IFNULL(arrest_sum, 0.00)) as arrest_nedv,
                    SUM(IFNULL(evaluation_sum, 0.00)) as evaluation_nedv,
                    SUM(IFNULL(realization_property_sum, 0.00)) as realization_property_nedv,
                    SUM(IFNULL(price_reduction_sum, 0.00)) as price_reduction_nedv,
                    SUM(IFNULL(realization_sum_2, 0.00)) as realization_sum_2_nedv,
                    SUM(IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)) as return_sum_nedv
                FROM property WHERE status != 2 group by inn) AS nedvizh ON meta.inn = nedvizh.inn
            LEFT JOIN (SELECT
                    inn, 
                    sum(total_sum) AS sum_debit_dept,
                    SUM(IFNULL(arrest_sum, 0.00)) as arrest_debit,
                    SUM(IFNULL(evaluation_sum, 0.00)) as evaluation_debit,
                    SUM(IFNULL(realization_property_sum, 0.00)) as realization_property_debit,
                    SUM(IFNULL(price_reduction_sum, 0.00)) as price_reduction_debit,
                    SUM(IFNULL(realization_sum_2, 0.00)) as realization_sum_2_debit,
                    SUM(IF(property_to_debtor_act IS NOT NULL, IFNULL(property_to_debtor_sum, 0.00), 0.00)) as return_sum_debit,
                    SUM(IF(dz_foreclose_date IS NOT NULL, IFNULL(dz_foreclose_sum, 0.00), 0.00)) as foreclose_debit
                FROM debit group by inn) AS debit ON meta.inn = debit.inn
            LEFT JOIN (SELECT
                inn, 
                sum(cost) AS sum_another,
                SUM(IFNULL(arrest_sum, 0.00)) as arrest_another,
                SUM(IFNULL(evaluation_sum, 0.00)) as evaluation_another,
                SUM(IFNULL(realization_property_sum, 0.00)) as realization_property_another,
                SUM(IFNULL(price_reduction_sum, 0.00)) as price_reduction_another,
                SUM(IFNULL(realization_sum_2, 0.00)) as realization_sum_2_another
            FROM another group by inn) AS another ON meta.inn = another.inn
            WHERE meta.inn = ?
        `,
        wantedTs: `
        SELECT 
            wanted_open,
            wanted_close,
            wanted_result,
            arrest_propperty
        FROM transport
        WHERE inn = ? AND status != 2
        `,
        wantedProperty: `
        SELECT 
            wanted_open,
            wanted_close,
            wanted_result,
            arrest_propperty
        FROM property
        WHERE inn = ? AND status != 2
        `,
        arrestTs: `
        SELECT
            transport.wanted_open,
            transport.wanted_close,
            transport.arrest_propperty,
            res.exec_date
        FROM transport
        LEFT JOIN (SELECT inn, post_number, exec_date FROM resolutions WHERE inn = ?) AS res ON transport.inn = res.inn
        WHERE transport.inn = ? AND transport.status != 2
        `,
        arrestProperty: `
        SELECT 
            property.wanted_open,
            property.wanted_close,
            property.arrest_propperty,
            res.exec_date
        FROM property
        LEFT JOIN (SELECT inn, post_number, exec_date FROM resolutions WHERE inn = ?) AS res ON property.inn = res.inn
        WHERE property.inn = ? AND property.status != 2
        `,
        arrestDebit: `
        SELECT 
            count(id) as debit_count,
            arrest_propperty,
            date as exec_date
        FROM debit
        WHERE inn = ?
        `,
        evaluationTs: `
        SELECT 
            transport.evaluation_accept,
            transport.arrest_propperty
        FROM transport
        WHERE transport.inn = ? AND transport.status != 2
            `,
        evaluationProperty: `
        SELECT 
            property.evaluation_accept,
            property.arrest_propperty
        FROM property
        WHERE property.inn = ? AND property.status != 2
            `,
        evaluationDebit: `
        SELECT 
            evaluation_accept,
            arrest_propperty
        FROM debit
        WHERE inn = ?
        `,
        realizationTs: `
        SELECT 
            transport.realization_submit,
            transport.evaluation_accept
        FROM transport
        WHERE transport.inn = ? AND transport.status != 2
        `,
        realizationProperty: `
        SELECT 
            property.realization_submit,
            property.evaluation_accept
        FROM property
        WHERE property.inn = ? AND property.status != 2
        `,
        realizationDebit: `
        SELECT 
            realization_submit,
            evaluation_accept
        FROM debit
        WHERE inn = ?
            `,
        resultTs: `
        SELECT 
            transport.price_reduction_resolution,
            transport.realization_result_2,
            transport.realization_submit
        FROM transport
        WHERE transport.inn = ? AND transport.status != 2
        `,
        resultProperty: `
        SELECT 
            property.price_reduction_resolution,
            property.realization_result_2,
            property.realization_submit
        FROM property
        WHERE property.inn = ? AND property.status != 2
        `,
        resultDebit: `
        SELECT 
            price_reduction_resolution,
            realization_result_2,
            realization_submit
        FROM debit
        WHERE inn = ?
            `,
        forecloseDebit: `
        SELECT
            count(id) AS debit_count,
            dz_foreclose_date,
            date AS exec_date
        FROM debit
        WHERE inn = ?
        `,
    }
}


export default query