import { download as downloadSelectors, download } from "../../queries/selectors.js"
import { createSheet, sendXLSXFile } from "./tablesConfig/create.js"
import {
    activeSheetConfigs,
    activesSheets,
    headersActivesStatistics,
    headersStatistics,
    headerStatisticsIP
} from "./tablesConfig/headers.js"
import { getDownloadDate, getDownloadTypeName } from './name_utils.js';


export const getStatistics = async(req, res) => {
    const { isDerived, isArchive, innList } = req.query

    const stats = await downloadSelectors.getStatistics(innList, isDerived, isArchive)
    const headers = headersStatistics(isDerived)

    const sheetNames = {
        general: "Статистика",
        actives: "Статистика по активам",
        debit:   "Статистика по дебит. задолж."
    }

    const namedSheets = Object.entries(sheetNames).map(
        ([ type, name ]) => [
                name,
                createSheet(stats[type], headers[type])
            ]
    );

    const name = (
        (innList ? `Выгрузка ` : 'Статистика регионов ')
        + getDownloadTypeName(isDerived, isArchive) + " "
        + getDownloadDate() + '.xlsx'
    );

    sendXLSXFile(
        res,
        Object.fromEntries(namedSheets),
        name
    )
}


export const getStatisticsIP = (req, res) => {
    const { isDerived, innList } = req.query

    download
        .getStatisticsIP(innList)
        .then(data => {
            const header = headerStatisticsIP(isDerived)
            const sheet = createSheet(data, header)
            sendXLSXFile(
                res,
                { "Статистика": sheet },
                `Выгрузка по ИП ${getDownloadDate()}.xlsx`
            )
        })
        .catch(console.log)
}


export const getDebtorActivesStat = async (request, response) =>  {
    const { inn, isDerived, isArchive }  = request.query

    const lizingKeyPostfix = 'NotFnsLizing';
    const lizingKeyTextPostfix = ' (залогод. не ФНС)';

    const headers = headersActivesStatistics(lizingKeyPostfix);
    const sheets = activesSheets(lizingKeyPostfix, lizingKeyTextPostfix);

    const stats = await downloadSelectors.getActivesStatistics(
        inn,
        isDerived, isArchive,
        activeSheetConfigs, lizingKeyPostfix
    );

    const name = (
        (inn ? `Выгрузка активов НП ${inn} ` : 'Активы НП регионов ')
        + getDownloadTypeName(isDerived, isArchive)
        + getDownloadDate() + '.xlsx'
    );

    const namedSheets = Object.entries(sheets).map(
        ([ type, name ]) => {
            return [
                name,
                createSheet(stats[type], headers[type])
            ]
        }
    );

    sendXLSXFile(
        response,
        Object.fromEntries(namedSheets),
        name
    )
};
