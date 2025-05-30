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

router.get("/get-interactions/:source", controllers.getInteractions)
router.post("/save-interaction/:source", upload.fields(uploadConfig), controllers.saveInteraction)

export default router