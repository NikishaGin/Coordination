import { actives, selectFieldsOccupancy, tableActives } from "../../queries/selectors.js"
import * as updates from "../../queries/updates.js"
import { aggregateIndicators, securingArrest } from "../indicators/service.js";



export async function getTables(request, response) {
    const role = request.userInfo.role
    const page = request.params.page
    const regionCode = request.params.regionCode
    const is_derivative_debt = +["DerivativeDebt", "DerivativeDebtArchive"].includes(page)
    const is_archive = +["IndexArchive", "DerivativeDebtArchive"].includes(page)
    const data = await actives.getTables(regionCode, is_derivative_debt, is_archive, role)
    for (const row of data) {
        for (const fieldName in row) {
            if (typeof row[fieldName] === "number") {
                row[fieldName] = row[fieldName].toString()
            }
        }
        row.indicators = await aggregateIndicators(row.inn)
        row.securingArrest = await securingArrest(row)
    }
    response.json(data)
}


export function getInfo(request, response) {
    const inn = request.params.inn
    actives
        .getInfo(inn)
        .then(([ data ]) => response.end(JSON.stringify(data)))
        .catch(console.log)
}


export function getResolutions(request, response) {
    const inn = request.params.inn
    actives
        .getResolutions(inn)
        .then(data => response.end(JSON.stringify(data)))
        .catch(console.log)
}


export async function getActivesStatistics(request, response) {
    const inn = request.params.inn
    const statistics = await actives.getActivesStatistics(inn)
    let result = {}
    try {
        let total_sum = 0
        for (let active in statistics) {
            let data = statistics[active][0]
            total_sum += parseFloat(data.cost ?? "0.00")
            result[active] = data
        }
        result.total_sum = total_sum
    } catch (error) {
        console.log(error)
    }
    response.end(JSON.stringify(result))
}


export function getDebt(request, response) {
    const inn = request.params.inn
    actives
        .getDebt(inn)
        .then(data => response.end(JSON.stringify(data)))
        .catch(console.log)
}


export function getActives(request, response) {
    const inn = request.params.inn
    const nameActive = request.params.nameActive
    actives.getActives(inn, nameActive)
        .then(data => response.end(JSON.stringify(data)))
        .catch(console.log)

}


export function createNewActives(request, response) {
    const userInfo = request.userInfo
    const nameActive = request.params.nameActive
    const inn = request.params.inn
    const data = {...request.body, inn}
    updates
        .createNewActives(nameActive, data, {inn, id: userInfo.id, role: userInfo.role})
        .then(() => response.end(JSON.stringify("")))
        .catch(console.log)
}


export function updateActives(request, response) {
    const userInfo = request.userInfo
    const nameActive = request.params.nameActive
    const inn = request.params.inn
    const data = request.body
    updates
        .updateActives(nameActive, data, {inn, id: userInfo.id, role: userInfo.role})
        .then(() => response.end(JSON.stringify("")))
        .catch(console.log)
}