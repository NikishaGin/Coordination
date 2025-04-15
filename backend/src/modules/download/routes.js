import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()


router.use((_, response, next) => {
    response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    next();
});

router.get("/get-statistics", controllers.getStatistics)
router.get("/get-statistics-IP", controllers.getStatisticsIP)

export default router