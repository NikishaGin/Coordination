import { service } from "../../queries/selectors.js"


export function getRegions(request, response) {
    const page = request.params.page
    const is_derivative_debt = +["DerivativeDebt", "DerivativeDebtArchive"].includes(page)
    const is_archive = +["IndexArchive", "DerivativeDebtArchive"].includes(page)
    service.getRegions(is_derivative_debt, is_archive).then(data => response.end(JSON.stringify(data))).catch(console.log)
}


export function getDebtTypes(_, response) {
    service.getDebtTypes().then(data => response.end(JSON.stringify(data.map(item => item.debt_type)))).catch(console.log)
}


export function checkServiceMode(_, response) {
    service.checkServiceMode().then(data => response.end(JSON.stringify(Boolean(data[0])))).catch(console.log)
}


export function changeServiceMode(_, response) {
    service.changeServiceMode().then(data => response.end(JSON.stringify(""))).catch(console.log)
}