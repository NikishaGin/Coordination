import db from "../connection.js"





async function setHistory(tableName, data, userInfo) {
    console.log(tableName)
    console.log(data)
    console.log(userInfo)

    /*
    try {
        const [id] = await db("history").insert({
            user_id: userInfo.id,
            table_name: tableName,
            action: ,
            row_id: ,
            inn: userInfo.inn
        })
        await db("history_fields").insert({
            change_id: ,
            field_name: 
        })
    } catch (error) {
        console.log(error)
    }
    */
}



export async function createNewActives(nameActive, data, userInfo) {
    const tableName = (nameActive === "ground") ? "property" : nameActive
    try {
        const result = await db(tableName).insert(data)
        await setHistory(tableName, data, userInfo)
        return result
    } catch (error) {
        throw error
    }


}


export async function updateActives(nameActive, data, userInfo) {
    const tableName = (nameActive === "ground") ? "property" : nameActive
    try {
        const result = await db.transaction(async trx => {
            const queries = Object.keys(data).map(id => (
                trx(tableName).where("id", id).update(data[id])
            ))
            try {
                const value = await Promise.all(queries)
                return trx.commit(value)
            } catch (error) {
                return trx.rollback(error)
            }
        })
        await setHistory(tableName, data, userInfo)
        return result
    } catch (error) {
        throw error
    }
}