import pool from "../connection.js"


export default async function(query, params=[]) {
    const connection = await pool.getConnection()
    const result = await connection
        .query(query, params)
        .then(([rows, _]) => rows)
        .catch(console.log)
    connection.release()
    return result
}