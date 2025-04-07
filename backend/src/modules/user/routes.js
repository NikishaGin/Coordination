import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.post("/login", controllers.loginUser)
router.get("/verify", controllers.verifyUser)
// router.get("/destroy", controllers.destroyUser)
  
export default router
