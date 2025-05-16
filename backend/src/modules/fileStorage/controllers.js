import crypto from "crypto"
import fs from "fs";
import { fileStorage } from "../../queries/selectors.js"


const DIR_FILE_STORE = "./FileStore/Library"
if (!fs.existsSync(DIR_FILE_STORE))
    fs.mkdirSync(DIR_FILE_STORE, { recursive: true })



export function getDocuments(request, response) {
    const source = request.params.source
    fileStorage
        .getDocuments(source)
        .then((data) => {
            const documents = data.map(item => {
                const url = `${DIR_FILE_STORE}/${item.new_filename}`;
                return {name: item.original_filename, url}
            })
            response.end(JSON.stringify(documents));
        })
        .catch(console.log)
}


export function saveDocument(request, response) {
    const source = request.params.source
    //const fileBuffer = request.file.buffer

    console.log(request.file)

    //fileStorage.saveDocument(source)
}


/*
  response.setHeader('Content-Type', 'application/octet-stream')
    response.setHeader('Content-Disposition', `attachment filename*=UTF-8''${encodeURIComponent(filename)}`)
    response.send(excel)
*/