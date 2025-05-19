import knex from "knex"
import { DB_CONFIG } from "./config.js";


const db = knex({
    ...DB_CONFIG,
    pool: {
        min: 2,
        max: 10,
    }
})

export default db