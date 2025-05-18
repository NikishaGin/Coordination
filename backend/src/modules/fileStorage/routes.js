import { Router } from 'express'
import multer from "multer"
import * as controllers from "./controllers.js"



const router = Router()
const upload = multer({storage: multer.memoryStorage()})
const uploadConfig = [
    {
        name: "name",
        maxCount: 1
    },
    {
        name: "file",
        maxCount: 1
    }
]

router.get("/get-documents/:source", controllers.getDocuments)
router.post("/save-document/:source", upload.fields(uploadConfig), controllers.saveDocument)

export default router