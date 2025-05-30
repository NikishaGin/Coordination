import { service } from "../../queries/selectors.js"
import { isArchive, isDerivedDebt } from "../../utils/controllers_utils.js";


export function getRegions(request, response) {
    const page = request.params.page
    const is_derivative_debt = isDerivedDebt(page)
    const is_archive = isArchive(page)
    service.getRegions(is_derivative_debt, is_archive).then(data => response.end(JSON.stringify(data))).catch(console.log)
}


export function getDebtTypes(_, response) {
    service.getDebtTypes().then(data => response.end(JSON.stringify(data.map(item => item.debt_type)))).catch(console.log)
}