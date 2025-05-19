import { download as downloadSelectors, download } from "../../queries/selectors.js"
import { createSheet, sendXLSXFile, getDateNow } from "./tablesConfig/create.js"
import { headersStatistics, headerStatisticsIP } from "./tablesConfig/headers.js"



export const getStatistics = async(req, res) => {
    const { isDerived, regionCode, innList } = req.query

    const stats = await downloadSelectors.getStatistics(regionCode, innList, isDerived)
    console.log(stats)
    const headers = headersStatistics(isDerived)

    const sheetNames = {
        general: "Ста",
        actives: "Ста по активам",
        debit:   "ста"
    }

    const namedSheets = Object.entries(sheetNames).map(
        ([ type, name ]) => [
            name,
            createSheet(stats[type], headers[type])
        ]
    );

    sendXLSXFile(
        res,
        Object.fromEntries(namedSheets),
        `Выгрузка_${regionCode}_${getDateNow()}.xlsx`
    );
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
            sendXLSXFile(response, { "Статистика": sheet }, `Выгрузка_по_ИП_${regionCode}_${getDateNow()}.xlsx`)
        })
        .catch(console.log)
}