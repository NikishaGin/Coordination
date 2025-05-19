import knex from "knex"
import { DB_CONFIG } from "./config.js";
import { mountKnexExtensions } from "./utils/knex_extensions.js";


mountKnexExtensions(knex)

const db = knex({
    ...DB_CONFIG,
    pool: {
        min: 2,
        max: 10,
    }
})

export default db