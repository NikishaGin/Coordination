import db from "../../connection.js";



export function getRegions(is_derivative_debt, is_archive) {
    return db('meta')
        .select([
            db.raw('DISTINCT meta.region AS regionCode'),
            'regions.regionName AS regionName'
        ])
        .leftJoin('resolutions', 'meta.inn', 'resolutions.inn')
        .leftJoin('regions', db.raw('meta.region COLLATE utf8mb4_general_ci = regions.regionCode'))
        .where({ 'resolutions.is_derivative_debt': is_derivative_debt, })
        .modify(query => {
            is_archive
                ? query.havingRaw(`COUNT(*) = SUM(CASE WHEN resolutions.is_archive = 1 THEN 1 ELSE 0 END)`)
                : query.havingRaw(`SUM(CASE WHEN resolutions.is_archive = 0 THEN 1 ELSE 0 END) > 0`);
        })
        .groupBy('meta.inn', 'regions.regionCode', 'regions.regionName')
}


export function getTypesDebtorCategory() {
    return db("debt_type").select("debt_type");
}