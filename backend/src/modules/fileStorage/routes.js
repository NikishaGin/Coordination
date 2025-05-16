import { Router } from 'express'
import multer from "multer"
import * as controllers from "./controllers.js"

const upload = multer({storage: multer.memoryStorage()})
const router = Router()

router.get("/get-documents/:source", controllers.getDocuments)
router.post("/save-document/:source", upload.single("file"), controllers.saveDocument)

export default router