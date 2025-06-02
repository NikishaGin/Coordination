import fs from "fs";
import crypto from "crypto";



export function createStorageDir(DIR_STORAGE) {
    if (!fs.existsSync(DIR_STORAGE))
        fs.mkdirSync(DIR_STORAGE, { recursive: true })
}


export function getExtension(filename) {
    return filename.split('.').pop()?.toLowerCase()
}


export function saveFile(DIR_STORAGE, originalFilename, extension, fileBuffer) {
    const generateName = originalFilename + Date.now().toString()
    const systemsFilename = crypto.createHash('sha256').update(generateName).digest('hex') + "." + extension
    fs.writeFile(`${DIR_STORAGE}/${systemsFilename}`, fileBuffer, function(error) {
        if (error) {
            console.error(error)
            throw new Error(error)
        }
    })
    return systemsFilename
}