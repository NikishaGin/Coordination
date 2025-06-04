import fs from "fs";
import {getExtension, saveFile} from "../fileStorage/service.js";
import {DIR_STORAGE, URL_PREFIX} from "./controllers.js";



function deleteFile(systemsFilename) {
    const path = `${DIR_STORAGE}/${systemsFilename}`
    fs.unlink(path, (error) => {
        if (error) {
            console.error(`Ошибка при удалении файла ${path}:`, error);
        }
    });
}


export function handleFileSave(file, systemsFilename, updatingFile) {
    if (!updatingFile) return {}
    if  (!file[0]?.originalname && !!systemsFilename) {
        deleteFile(systemsFilename)
        return {}
    } else if (file[0]) {
        const extension = getExtension(file[0].originalname)
        const filename = file[0].originalname.split(".").slice(0, -1).join(".")
        const buffer = file[0]?.buffer
        return {
            originalFilename: file[0].originalname,
            systemsFilename: saveFile(DIR_STORAGE, filename, extension.toLowerCase(), buffer)
        }
    } else
        return {}
}


export function createURL(systemsFilename, originalFilename) {
    if (systemsFilename)
        return `${URL_PREFIX}/${systemsFilename}?filename="${encodeURIComponent(originalFilename)}"`
    else
        return undefined
}


export const formatDate = dateStr => dateStr.split('T')[0];