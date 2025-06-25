import db from "../../connection.js";



export function getRegions(is_derivative_debt, is_archive) {
    return db('meta')
        .select([
            db.raw('DISTINCT meta.region AS regionCode'),
            'regions.regionName AS regionName'
        ])
        .leftJoin('resolutions', 'meta.inn', 'resolutions.inn')
        .leftJoin('regions', db.raw('meta.region COLLATE utf8mb4_general_ci = regions.regionCode'))
        .modify(query => {
            if (is_derivative_debt)
                query.havingRaw("MAX(resolutions.is_derivative_debt) = 1")
            else
                query.havingRaw("MIN(resolutions.is_derivative_debt) = 0")
            if (is_archive)
                query.havingRaw("MIN(resolutions.is_archive) = 1")
            else
                query.havingRaw("MIN(resolutions.is_archive) = 0")
        })
        .groupBy('meta.inn', 'regions.regionCode', 'regions.regionName')
}


export function getTypesDebtorCategory() {
    return db("debt_type").select("debt_type");
}