import queryIndex from "./queries/Index.js"
import queryIndexArchive from "./queries/IndexArchive.js"
import queryDerivativeDebt from "./queries/DerivativeDebt.js"
import queryDerivativeDebtArchive from "./queries/DerivativeDebtArchive.js"



function queryGetTable(connection, query, regionCode) {
    return connection
        .query(query, [regionCode])
        .then(([rows, ]) => rows)
        .catch(console.log)
}


export default function (connection, page, regionCode) {
    if (page === "Index")
        return queryGetTable(connection, queryIndex, regionCode)
    else if (page === "IndexArchive")
        return queryGetTable(connection, queryIndexArchive, regionCode)
    else if (page === "DerivativeDebt")
        return queryGetTable(connection, queryDerivativeDebt, regionCode)
    else if (page === "DerivativeDebtArchive")
        return queryGetTable(connection, queryDerivativeDebtArchive, regionCode)
}