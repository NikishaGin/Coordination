import queryCommon from "./queries/common.js"



export function getRegions(connection, page) {
    let params
    if (page === "Index")
        params = [0, 0]
    else if (page === "IndexArchive")
        params = [0, 1]
    else if (page === "DerivativeDebt")
        params = [1, 0]
    else if (page === "DerivativeDebtArchive")
        params = [1, 1]
    return connection
        .query(queryCommon.getRegions, params)
        .then(([rows, _]) => rows.map(item => item.regionCode))
        .catch(console.log)
}

export function getRegionName(connection, regionCode) {
    return connection.query(queryCommon.getRegionName, [regionCode])
        .then(([rows, _]) => rows[0].regionName)
        .catch(console.log)
}

export function getDebtTypes(connection) {
    return connection.query(queryCommon.getDebtTypes)
        .then(([rows, _]) => rows)
        .catch(console.log)
}

export async function getInfo(connection, inn) {
    let result = {}
    for (let key in queryCommon.getInfo) {
        let query = queryCommon.getInfo[key]
        await connection.query(query, [inn])
            .then(([rows, _]) => {
                result[key] = rows
            })
            .catch(console.log)
    }
    return result
}

export async function getActives(connection, inn) {
    let result = {}
    for (let key in queryCommon.getActives) {
        let query = queryCommon.getActives[key]
        await connection.query(query, [inn])
            .then(([rows, _]) => {
                result[key] = rows
            })
            .catch(console.log)
    }
    return result
}

export async function getDetail(connection, inn) {
    let result = {}
    for (let key in queryCommon.getDetail) {
        let query = queryCommon.getDetail[key]
        let params = (["arrestTs", "arrestProperty"].includes(key)) ? [inn, inn] : [inn]
        await connection.query(query, params)
            .then(([rows, _]) => {
                result[key] = rows
            })
            .catch(console.log)
    }
    return result
}

