import { Router } from 'express'
import multer from "multer"
import * as controllers from "./controllers.js"



const router = Router()
const upload = multer({storage: multer.memoryStorage()})
const uploadConfig = [
    {
        name: "inn",
        maxCount: 1
    },
    {
        name: "referral_date",
        maxCount: 1
    },
    {
        name: "review_date",
        maxCount: 1
    },
    {
        name: "result",
        maxCount: 1
    },
    {
        name: "kno",
        maxCount: 1
    },
    {
        name: "note",
        maxCount: 1
    },
    {
        name: "file",
        maxCount: 2
    }
]

router.get("/get-interactions/:source/:inn", controllers.getInteractions)
router.post("/save-interaction/:source/:inn/:type", upload.fields(uploadConfig), controllers.saveInteraction)

export default router