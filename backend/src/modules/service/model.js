import db from "../../connection.js";



export function getRegions(is_derivative_debt, is_archive) {
    return db('meta').select([
            db.raw('DISTINCT meta.region AS regionCode'),
            'regions.regionName AS regionName'
        ])
        .leftJoin('resolutions', 'meta.inn', 'resolutions.inn')
        .leftJoin('regions', db.raw('meta.region COLLATE utf8mb4_general_ci = regions.regionCode'))
        .where({
            'resolutions.is_derivative_debt': is_derivative_debt,
            'resolutions.is_archive': is_archive
        })
        .orderBy('meta.region', 'asc')
}


export function getTypesDebtorCategory() {
    return db("debt_type").select("debt_type");
}