import { actives } from "../../queries/selectors.js"



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