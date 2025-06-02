import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.get("/get-regions/:page", controllers.getRegions)
router.get("/get-types-debtor-category", controllers.getTypesDebtorCategory)

export default router