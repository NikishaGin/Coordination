import { Router } from "express"
import routerService from "./modules/service/routes.js"
import routerActives from "./modules/actives/routes.js"


const router = Router()

router.use("/service", routerService)
router.use("/actives", routerActives)
// router.use("/admin", routerAdmin)
// router.use("/download", routerDownload)
// router.use("/feedback", routerFeedback)

export default router