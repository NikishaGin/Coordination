import db from "../../connection.js";
import { getResolutions } from "../../queries/subqueries.js"

/*

end_date        (null)
terminate_date  (null)
is_archive      (0 / 1)

*/

export function getRegions(is_derivative_debt, is_archive) {
    return db('meta')
        .select([
            db.raw('DISTINCT meta.region AS regionCode'),
            'regions.regionName AS regionName'
        ])
        .innerJoin(db.raw('(??) as resolutions_data', [
            getResolutions(is_derivative_debt, is_archive, {selectSumData: false})
        ]), 'meta.inn', 'resolutions_data.inn')
        .leftJoin('regions', db.raw('meta.region COLLATE utf8mb4_general_ci = regions.regionCode'))
        .groupBy('meta.inn', 'regions.regionCode', 'regions.regionName')
}


export function getTypesDebtorCategory() {
    return db("debt_type").select("debt_type");
}