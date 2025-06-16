import db from "../../connection.js";
import {tableActives} from "../../queries/selectors.js";



export async function getExecMinDate(inn) {
    console.log(inn)
    const [{ execMinDate }] = await db("resolutions").min("exec_date as execMinDate").where({ inn })
    return execMinDate
}


export async function getMaxLoadDate(inn) {
    const datesArr = await tableActives(inn, query => query.max("load_date as maxLoadDate"))

    const entries = Object.entries(datesArr)
    const listDates = entries.map(([_, data]) => new Date(data[0].maxLoadDate ?? 0))

    return Math.max(...listDates)
}


export async function isLizingFNS(inn) {
    const modify = (query, name) => {
        return name !== "debit"
            ? query.where({is_fns_lizing: 1}).first("id as exists")
            : query.whereRaw("false")
    }
    return await tableActives(inn, modify).then(Boolean)
}