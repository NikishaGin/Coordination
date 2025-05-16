import { Router } from "express"
import routerUser from "./user/routes.js"
import routerService from "./service/routes.js"
import routerActives from "./actives/routes.js"
import routerDownload from "./download/routes.js"
import routerFileStorage from "./fileStorage/routes.js"


const router = Router()

router.use("/user", routerUser)
router.use("/service", routerService)
router.use("/actives", routerActives)
router.use("/download", routerDownload)
router.use("/file-storage", routerFileStorage)

export default router