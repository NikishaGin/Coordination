import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.get("/get-table/:page/:regionCode", controllers.getTables)
router.get("/get-info/:inn", controllers.getInfo)
router.get("/get-resolutions/:inn", controllers.getResolutions)
  
export default router