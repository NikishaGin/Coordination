import express from "express"
import cors from "cors"
import {APP_CONFIG} from "./src/config.js"
import baseRouter from "./src/modules/routes.js"


const app = express()
app.use(express.json(), cors())
app.use("/api-coordination", baseRouter)
app.listen(APP_CONFIG.port, APP_CONFIG.host, function () {
  console.log(`Сервер запущен на http://${APP_CONFIG.host}:${APP_CONFIG.port}/ ...`)
})