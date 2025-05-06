import { actives } from "../../queries/selectors.js"
import * as updates from "../../queries/updates.js"
import userIdentification from "../user/controllers.js"


export function getTables(request, response) {
    const page = request.params.page
    const regionCode = request.params.regionCode
    const is_derivative_debt = +["DerivativeDebt", "DerivativeDebtArchive"].includes(page)
    const is_archive = +["IndexArchive", "DerivativeDebtArchive"].includes(page)
    actives
        .getTables(regionCode, is_derivative_debt, is_archive)
        .then(data => response.end(JSON.stringify(data)))
        .catch(console.log)
}


export function getInfo(request, response) {
    const inn = request.params.inn
    actives
        .getInfo(inn)
        .then(data => response.end(JSON.stringify(data[0])))
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
    const queries = actives.getActivesStatistics(inn)
    let result = {}
    try {
        let total_sum = 0
        for (let active in queries) {
            let data = (await queries[active])[0]
            total_sum += data.cost ?? 0.00
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
    const token = request.headers.authorization
    const userInfo = userIdentification(token).userInfo
    const nameActive = request.params.nameActive
    const inn = request.params.inn
    const data = request.body
    updates.createNewActives(nameActive,  data, {inn, id: userInfo.id, role: userInfo.role})
        .then(([id]) => {
            const newId = Array.isArray(data) ? Array.from({ length: data.length }, (_, i) => id + i) : id
            const result = (Array.isArray(newId) && (newId.length == 1)) ? newId[0] : newId
            response.end(JSON.stringify(result))
        })
        .catch(console.log)
}


export function updateActives(request, response) {
    const token = request.headers.authorization
    const userInfo = userIdentification(token).userInfo
    const nameActive = request.params.nameActive
    const inn = request.params.inn
    const data = request.body
    updates
        .updateActives(nameActive, data, {inn, id: userInfo.id, role: userInfo.role})
        .then(d => {
            console.log(d)

            
            response.end(JSON.stringify(""))
        })
        .catch(console.log)
}