import dotenv from "dotenv"
import knex from "knex"
import { mountKnexExtensions } from "./utils/knex_extensions.js";



dotenv.config()

mountKnexExtensions(knex)

const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST ?? "127.0.0.1",
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD
    },
    pool: {
        min: 2,
        max: 10,
    }
})

export const APP_CONFIG = {
    host: process.env.APP_HOST ?? "127.0.0.1",
    port: process.env.APP_PORT ?? 3022
}

export default db