import { Router } from "express"
import routerUser from "./user/routes.js"
import routerService from "./service/routes.js"
import routerActives from "./actives/routes.js"


const router = Router()

router.use("/user", routerUser)
router.use("/service", routerService)
router.use("/actives", routerActives)
// router.use("/download", routerDownload)
// router.use("/feedback", routerFeedback)

export default router