import { Router } from 'express'
import * as controllers from "./controllers.js"


const router = Router()


router.use((_, response, next) => {
    response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    next();
});

router.get("/get-documents/:", controllers.getDocuments)
router.post("/save-document", controllers.saveDocument)

export default router