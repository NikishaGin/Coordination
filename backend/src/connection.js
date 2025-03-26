import dotenv from "dotenv"
import mysql2 from "mysql2"


dotenv.config()

const pool = mysql2.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    user:  process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
}).promise()


export const APP_CONFIG = {
    host: process.env.APP_HOST ?? "127.0.0.1",
    port: process.env.APP_PORT ?? 3022
}

export default pool