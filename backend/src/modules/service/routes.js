import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.get("/det-regions/:page", controllers.getRegions)
router.get("/get-region-name/:regionCode", controllers.getRegionName)
router.get("/get-debt-types", controllers.getDebtTypes)
  
export default router