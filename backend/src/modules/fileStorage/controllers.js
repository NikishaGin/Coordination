import fs from "fs";
import * as models from "./models.js"
import {createStorageDir, getExtension, saveFile} from "./service.js";
import { APP_CONFIG } from "../../config.js";



const DIR_STORAGE = "./FileStore/Library"
const URL_PREFIX = `http://${APP_CONFIG.host}:${APP_CONFIG.port}${DIR_STORAGE.slice(1)}`

createStorageDir(DIR_STORAGE)


export async function getDocuments(request, response) {
    const source = request.params.source
    try {
        const data = await models.getDocuments(source)
        const documents = data.map(item => {
            if (fs.existsSync(`${DIR_STORAGE}/${item.systemsFilename}`)) {
                return {
                    name: item.originalFilename,
                    url: `${URL_PREFIX}/${item.systemsFilename}?filename="${encodeURIComponent(item.originalFilename)}"`
                }
            } else
                return undefined
        })
        const existingDocuments = documents.filter(item => item);
        response.status(200).json(existingDocuments);
    } catch (error) {
        console.log(error)
        response.status(500).json([])
    }
}


export async function saveDocument(request, response) {
    const source = request.params.source
    const filename = request.body.name
    const extension = getExtension(request.files.file[0].originalname)
    const fileBuffer = request.files.file[0].buffer
    try {
        const originalFilename = filename + "." + extension
        const systemsFilename = saveFile(DIR_STORAGE, filename, extension, fileBuffer)
        await models.saveDocument({ source, originalFilename, systemsFilename })
        const data = {
            name: originalFilename,
            url: `${URL_PREFIX}/${systemsFilename}?filename="${encodeURIComponent(originalFilename)}"`
        }
        response.end(JSON.stringify(data));
    } catch (error) {
        console.log(error)
        response.status(500).json({})
    }
}