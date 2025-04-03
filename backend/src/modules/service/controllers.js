import db from "../../connection.js"


export async function getRegions(request, response) {
    const page = request.params.page
    db('meta')
        .select(db.raw('DISTINCT meta.region AS regionCode'), 'regions.regionName AS regionName')
        .leftJoin('resolutions', 'meta.inn', 'resolutions.inn')
        .leftJoin('regions', db.raw('meta.region COLLATE utf8mb4_general_ci = regions.regionCode'))
        .where({
            'resolutions.is_derivative_debt': +((page === "DerivativeDebt") || (page === "DerivativeDebtArchive")),
            'resolutions.is_archive': +((page === "IndexArchive") || (page === "DerivativeDebtArchive"))
        })
        .orderBy('meta.region', 'asc')
        .then(data => response.end(JSON.stringify(data)))
        .catch(console.log)
}


export async function getDebtTypes(_, response) {
    db("debt_type").select("*").then(data => response.end(JSON.stringify(data))).catch(console.log)
}