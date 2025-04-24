import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.get("/get-table/:page/:regionCode", controllers.getTables)
router.get("/get-info/:inn", controllers.getInfo)
router.get("/get-info/:inn/resolutions", controllers.getResolutions)
router.get("/get-info/:inn/actives-statistics", controllers.getActivesStatistics)
router.get("/get-info/:inn/debt", controllers.getDebt)
router.get("/get-actives/:inn/:nameActive", controllers.getActives)


export default router