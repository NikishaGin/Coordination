import fs from "fs";
import {createStorageDir, getExtension, saveFile} from "../fileStorage/service.js"
import * as models from "./models.js"



const DIR_STORAGE = "./FileStore/Interactions"
createStorageDir(DIR_STORAGE)


export async function getInteractions(request, response) {
    const { source, inn } = request.params
    try {
        const data = await models.getInteractions(source, inn)


        const documents = data.map(item => {
            return {
                id: item.id,
                submissionDate: item.submissionDate,
                reviewDate: item.reviewDate,
                result: item.result,
                kno: item.kno,
                note: item.note,

                url_1: `${DIR_STORAGE}/${item.filename_1}`,
                url_2: `${DIR_STORAGE}/${item.filename_2}`
            }
        })




        const existingDocuments = documents.filter(({url}) => fs.existsSync(url));
        response.status(200).json(existingDocuments);
    } catch (error) {
        console.log(error)
        response.status(500).json([])
    }
}


export async function saveInteraction(request, response) {
    const { source, inn, type } = request.params

}