import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()

router.post("/login", controllers.loginUser)
  
export default router
