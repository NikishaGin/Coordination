import * as models from "./model.js"
import { isArchive, isDerivedDebt } from "../../utils/controllers_utils.js";



export async function getRegions(request, response) {
    const page = request.params.page
    const is_derivative_debt = isDerivedDebt(page)
    const is_archive = isArchive(page)
    try {
        const regions = await models.getRegions(is_derivative_debt, is_archive)
        response.status(200).json(regions)
    } catch (error) {
        console.log(error)
        response.status(500).json([])
    }
}


export async function getTypesDebtorCategory(_, response) {
    try {
        const typesDebtorCategory = await models.getTypesDebtorCategory()
        const result = typesDebtorCategory.map(item => item.debt_type)
        response.status(200).json(result)
    } catch (error) {
        console.log(error)
        response.status(500).json([])
    }
}