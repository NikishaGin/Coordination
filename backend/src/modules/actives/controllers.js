import { actives } from "../../queries/selectors.js"
import { formatPrice } from "../../utils/formatData.js"


export function getTables(request, response) {
    const page = request.params.page
    const regionCode = request.params.regionCode
    const is_derivative_debt = +["DerivativeDebt", "DerivativeDebtArchive"].includes(page)
    const is_archive = +["IndexArchive", "DerivativeDebtArchive"].includes(page)
    actives
        .getTables(regionCode, is_derivative_debt, is_archive)
        .then(data => {
            const normalizeData = data.map(item => {
                item.post_sum = formatPrice(item.post_sum)
                item.cur_debt = formatPrice(item.cur_debt)
                item.total_sum = formatPrice(item.total_sum)
                item.arrest = formatPrice(item.arrest)
                item.evaluation = formatPrice(item.evaluation)
                item.realization_property = formatPrice(item.realization_property)
                item.price_reduction = formatPrice(item.price_reduction)
                item.realization_sum_2 = formatPrice(item.realization_sum_2)
                item.return_sum = formatPrice(item.return_sum)
                item.debitor = formatPrice(item.debitor)
                return item
            })
            response.end(JSON.stringify(normalizeData))
        })
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
        .then(data => {
            const normalizeData = data.map(item => {
                item.resolutions_date = item.resolutions_date.toLocaleDateString()
                item.exec_date = item.exec_date.toLocaleDateString()
                item.resolutions_sum = formatPrice(item.resolutions_sum)
                item.cur_debt = formatPrice(item.cur_debt)
                return item
            })
            response.end(JSON.stringify(normalizeData))
        })
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
            data.cost = (data.cost) ? formatPrice(data.cost) : "-"
            result[active] = data
        }
        result.total_sum = formatPrice(total_sum)
    } catch (error) {
        console.log(error)
    }
    response.end(JSON.stringify(result))
}


export function getDebt(request, response) {
    const inn = request.params.inn
    actives
        .getDebt(inn)
        .then(data => {
            const normalizeData = data.map(item => {
                const [day, month, year] = item.date.toLocaleDateString().split('.')
                item.date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
                item.total_sum = formatPrice(item.total_sum)
                return item
            })
            response.end(JSON.stringify(normalizeData))
        })
        .catch(console.log)
}


export function getActives(request, response) {
    const inn = request.params.inn
    const nameActive = request.params.nameActive
    actives.getActives(inn, nameActive)
        .then(data => {
            const normalizeData = data.map(item => {
                item.cost = (item.cost) ? formatPrice(item.cost) : "-"
                if (item.date)
                    item.date = item.date.toLocaleDateString()
                return item
            })
            response.end(JSON.stringify(normalizeData))
        })
        .catch(console.log)

}