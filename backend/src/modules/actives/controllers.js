import databaseQuery from "../../utils/databaseQuery.js"
import query from "./queries/tables.js"


export async function getTables(request, response) {
    const regionCode = request.params.regionCode  
    const data = await databaseQuery(query, [regionCode])
    response.end(JSON.stringify(data))
}