import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.post("/login", controllers.loginUser)
router.get("/check-service-mode", controllers.checkServiceMode)
router.post("/change-service-mode", controllers.changeServiceMode)

export default router