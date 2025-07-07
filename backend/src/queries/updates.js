import db from "../connection.js"
import {ROLES} from "../types.js";



async function setHistory(tableName, data, rowId, userInfo, action) {
    if (![ROLES.GMULimitedAdmin, ROLES.GMUArkhangelsk].includes(userInfo.role)) return
    try {
        const [id] = await db("history").insert({
            user_id: userInfo.id,
            table_name: tableName,
            action: action,
            row_id: rowId,
            inn: userInfo.inn
        })
        const changedFields = Object.keys(data).map((field_name) => {
            return {change_id: id, field_name}
        })
        await db("history_fields").insert(changedFields)
    } catch (error) {
        console.log(error)
    }
}


export async function createNewActives(nameActive, data, userInfo) {
    const tableName = (nameActive === "ground") ? "property" : nameActive
    try {
        const result = await db(tableName).insert(data)
        const newId = result[0]
        await setHistory(tableName, data, newId, userInfo, "insert")
        return newId
    } catch (error) {
        throw error
    }
}


export async function updateActives(nameActive, data, userInfo) {
    const tableName = (nameActive === "ground") ? "property" : nameActive
    try {
        const [id, updatedData] = Object.entries(data)[0]
        await db(tableName).where({ id }).update(updatedData)
        await setHistory(tableName, updatedData, id, userInfo, "update")
    } catch (error) {
        throw error
    }
}