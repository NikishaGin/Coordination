import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.post("/login", controllers.loginUser)
router.get("/get-service-mode", controllers.getServiceMode)
router.post("/toggle-service-mode", controllers.toggleServiceMode)

export default router