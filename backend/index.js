import path from 'path'
import express from "express"
import cors from "cors"
import {APP_CONFIG} from "./src/config.js"
import baseRouter from "./src/modules/routes.js"
import {rootErrorHandler} from "./src/middleware.js";


const app = express()
app.use(
    cors({ origin: "*", exposedHeaders: ["Content-Disposition"] }),
    express.json(),
)

app.use('/FileStore', (req, res, next) => {
  if (req.method === 'GET') {
    const fileName = decodeURIComponent(req.query.filename)
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  }
  next();
});
app.use('/FileStore/Library', express.static('./FileStore/Library'));
app.use('/FileStore/Interactions', express.static('./FileStore/Interactions'));
app.use("/api-coordination", baseRouter)
app.use(rootErrorHandler)

app.listen(APP_CONFIG.port, APP_CONFIG.host, () => {
  console.log(`Сервер запущен на http://${APP_CONFIG.host}:${APP_CONFIG.port}/ ...`)
})

