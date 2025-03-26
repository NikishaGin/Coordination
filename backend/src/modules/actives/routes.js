import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.get("/get-table/:page/:regionCode", controllers.getTables)
  
export default router