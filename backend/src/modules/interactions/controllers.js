import fs from "fs";
import * as models from "./models.js"
import {createURL, formatDate, handleFileSave} from "./service.js";
import { createStorageDir } from "../fileStorage/service.js"
import { APP_CONFIG } from "../../config.js";



export const DIR_STORAGE = "./FileStore/Interactions"
export const URL_PREFIX = `http://${APP_CONFIG.host}:${APP_CONFIG.port}${DIR_STORAGE.slice(1)}`

createStorageDir(DIR_STORAGE)



export async function getInteractions(request, response) {
    const { source, inn } = request.params
    try {
        const data = await models.getInteractions(source, inn)
        const documents = data.map(item => {
            const isExistingFile_1 = fs.existsSync(`${DIR_STORAGE}/${item.systemsFilename_1}`)
            const isExistingFile_2 = fs.existsSync(`${DIR_STORAGE}/${item.systemsFilename_2}`)
            const url_1 = createURL(item.systemsFilename_1, item.originalFilename_1)
            const url_2 = createURL(item.systemsFilename_2, item.originalFilename_2)
            return {
                id: item.id,
                submissionDate: item.submissionDate,
                reviewDate: item.reviewDate,
                result: item.result,
                ...((source === "tno") ? { kno: item.kno, note: item.note } : {}),
                name_1: (isExistingFile_1) ? item.originalFilename_1 : undefined,
                name_2: (isExistingFile_2) ? item.originalFilename_2 : undefined,
                url_1: (isExistingFile_1) ? url_1 : undefined,
                url_2: (isExistingFile_2) ? url_2 : undefined
            }
        })
        response.status(200).json(documents);
    } catch (error) {
        console.log(error)
        response.status(500).json([])
    }
}


export async function saveInteraction(request, response) {
    const { source } = request.params
    const { data: jsonData, firstFile: _, secondFile: __ } = request.body
    const { id, submissionDate, reviewDate, updatingFirstFile, updatingSecondFile, ...data } = JSON.parse(jsonData)
    const { firstFile=[], secondFile=[] } = request.files;
    try {
        const existingFile = await models.checkFile(id) || {};

        const {
            originalFilename: originalFilename_1,
            systemsFilename: systemsFilename_1
        } = handleFileSave(firstFile, existingFile.systemsFilename_1, updatingFirstFile)
        const {
            originalFilename: originalFilename_2,
            systemsFilename: systemsFilename_2
        } = handleFileSave(secondFile, existingFile.systemsFilename_2, updatingSecondFile)

        const insertId = await models.upsertInteraction(id, {
            source,
            submissionDate: (submissionDate) ? formatDate(submissionDate) : submissionDate,
            reviewDate: (reviewDate) ? formatDate(reviewDate) : reviewDate,
            ...data,
            ...((updatingFirstFile) ? { originalFilename_1, systemsFilename_1 } : {}),
            ...((updatingSecondFile) ? { originalFilename_2, systemsFilename_2 } : {})
        })

        const responseStatus = (id && id !== "undefined") ? 200 : 201;

        const result = {
            id: insertId,
            name_1: (updatingFirstFile) ? originalFilename_1 : existingFile.originalFilename_1,
            name_2: (updatingSecondFile) ? originalFilename_2 : existingFile.originalFilename_2,
            url_1: (updatingFirstFile) ? createURL(systemsFilename_1, originalFilename_1) : createURL(existingFile.systemsFilename_1, existingFile.originalFilename_1),
            url_2: (updatingSecondFile) ? createURL(systemsFilename_2, originalFilename_2) : createURL(existingFile.systemsFilename_2, existingFile.originalFilename_2)
        }

        response.status(responseStatus).json(result);
    } catch (error) {
        console.log(error)
        response.status(500).json({})
    }
}