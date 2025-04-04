import { Router } from "express"
import routerUsers from "./users/routes.js"
import routerService from "./service/routes.js"
import routerActives from "./actives/routes.js"


const router = Router()

router.use("/users", routerUsers)
router.use("/service", routerService)
router.use("/actives", routerActives)
// router.use("/download", routerDownload)
// router.use("/feedback", routerFeedback)

export default router