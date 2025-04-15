import { service } from "../../queries/selectors.js"


export function getRegions(request, response) {
    const page = request.params.page
    const is_derivative_debt = +["DerivativeDebt", "DerivativeDebtArchive"].includes(page)
    const is_archive = +["IndexArchive", "DerivativeDebtArchive"].includes(page)
    service.getRegions(is_derivative_debt, is_archive).then(data => response.end(JSON.stringify(data))).catch(console.log)
}


export function getDebtTypes(_, response) {
    service.getDebtTypes().then(data => response.end(JSON.stringify(data))).catch(console.log)
}