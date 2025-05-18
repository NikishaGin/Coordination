import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.get("/get-regions/:page", controllers.getRegions)
router.get("/get-debt-types", controllers.getDebtTypes)
router.get("/check-service-mode", controllers.checkServiceMode)
router.post("/change-service-mode", controllers.changeServiceMode)

export default router