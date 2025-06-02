import fs from "fs";
import * as models from "./models.js"
import {createStorageDir, getExtension, saveFile} from "./service.js";



const DIR_STORAGE = "./FileStore/Library"
createStorageDir(DIR_STORAGE)


export async function getDocuments(request, response) {
    const source = request.params.source
    try {
        const data = await models.getDocuments(source)
        const documents = data.map(item => ({
                name: item.originalFilename,
                filename: `${item.originalFilename}.${getExtension(item.systemsFilename)}`,
                url: `${DIR_STORAGE}/${item.systemsFilename}`
        }))
        const existingDocuments = documents.filter(({url}) => fs.existsSync(url));
        response.status(200).json(existingDocuments);
    } catch (error) {
        console.log(error)
        response.status(500).json([])
    }
}


export async function saveDocument(request, response) {
    const source = request.params.source
    const originalFilename = request.body.name
    const extension = getExtension(request.files.file[0].originalname)
    const fileBuffer = request.files.file[0].buffer
    try {
        const systemsFilename = saveFile(DIR_STORAGE, originalFilename, extension, fileBuffer)
        await models.saveDocument({ source, originalFilename, systemsFilename })
        const data = {
            name: originalFilename,
            filename: `${originalFilename}.${extension}`,
            url: `${DIR_STORAGE}/${systemsFilename}`,
        }
        response.end(JSON.stringify(data));
    } catch (error) {
        console.log(error)
        response.status(500).json({})
    }
}