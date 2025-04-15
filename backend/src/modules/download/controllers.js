import { download } from "../../queries/selectors.js"
import { createSheet, createAndSendTable, getDateNow } from "./tablesConfig/create.js"
import { headerStatisticsIP } from "./tablesConfig/headers.js"



export function getStatistics(request, response) {
    const isDerived = request.query.isDerived
    const regionCode = request.query.regionCode
    const innList = request.query.innList
    download
        .getStatistics(regionCode, innList)
        .then(data => {
            ////
        })
        .catch(console.log)
}


export function getStatisticsIP(request, response) {
    const isDerived = request.query.isDerived
    const regionCode = request.query.regionCode
    const innList = request.query.innList
    download
        .getStatisticsIP(regionCode, innList)
        .then(data => {
            const header = headerStatisticsIP(isDerived)
            const sheet = createSheet(data, header)
            createAndSendTable(response, { "Статистика": sheet }, `Выгрузка_по_ИП_${regionCode}_${getDateNow()}.xlsx`)
        })
        .catch(console.log)
}