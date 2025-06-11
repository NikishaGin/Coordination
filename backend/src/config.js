import dotenv from "dotenv";

dotenv.config()

export const DB_CONFIG = {
    client: process.env.DB_CLIENT,
    connection: {
        host: process.env.DB_HOST ?? "127.0.0.1",
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    }
}

export const SECRET_KEY = process.env.SECRET_KEY

export const APP_CONFIG = {
    host: process.env.APP_HOST ?? "127.0.0.1",
    port: process.env.APP_PORT ?? 3022
}