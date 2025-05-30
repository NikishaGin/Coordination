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
                return {
                    name: item.original_filename,
                    filename: item.original_filename + "." + item.new_filename.split('.').pop()?.toLowerCase(),
                    url: `${DIR_FILE_STORE}/${item.new_filename}`
                }
            })
            response.end(JSON.stringify(documents));
        })
        .catch(console.log)
}


export function saveDocument(request, response) {
    const source = request.params.source
    const original_filename = request.body.name
    const fileBuffer = request.files.file[0].buffer
    const extension = request.files.file[0].originalname.split('.').pop()?.toLowerCase()
    const new_filename = crypto
        .createHash('sha256')
        .update(original_filename + Date.now().toString())
        .digest('hex') + "." + extension

    fs.writeFile(`${DIR_FILE_STORE}/${new_filename}`, fileBuffer, (err) => {
        if (err) {
            response.end(JSON.stringify([]));
            console.log(err)
        }  else {
            fileStorage
                .saveDocument({source, original_filename, new_filename})
                .then(() => {
                    const data = {
                        name: original_filename,
                        filename: original_filename + "." + extension,
                        url: `${DIR_FILE_STORE}/${new_filename}`,
                    }
                    response.end(JSON.stringify(data));
                })
                .catch(error => {
                    response.end(JSON.stringify([]));
                    console.log(error)
                })
        }
    })
}