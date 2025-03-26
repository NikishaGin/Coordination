import databaseQuery from "../../utils/databaseQuery.js"
import query from "./queries/common.js"



export async function getRegions(request, response) {
    const page = request.params.page
    const queryParams = [
        +((page === "DerivativeDebt") || page === "DerivativeDebtArchive"),
        +((page === "IndexArchive") || (page === "DerivativeDebtArchive"))
    ]
    let allRegions = await databaseQuery(query.getRegions, queryParams)
    allRegions = allRegions.map(item => item.regionCode)
    response.end(JSON.stringify(allRegions))
}


export async function getRegionName(request, response) {
    const regionCode = request.params.regionCode  
    let regionName = await databaseQuery(query.getRegionName, [regionCode])
    regionName = regionName[0].regionName
    response.end(JSON.stringify(regionName))
}


export async function getDebtTypes(_, response) {
    const allDebtType = await databaseQuery(query.getDebtTypes)
    response.end(JSON.stringify(allDebtType))
}