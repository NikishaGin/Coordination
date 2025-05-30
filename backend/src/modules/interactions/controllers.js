import crypto from "crypto"
import fs from "fs";
import { interactions } from "../../queries/selectors.js"


const DIR_FILE_STORE = "./FileStore/Interactions"
if (!fs.existsSync(DIR_FILE_STORE))
    fs.mkdirSync(DIR_FILE_STORE, { recursive: true })



export async function getInteractions(request, response) {
    const { source, inn } = request.params
    const data = await interactions.getInteractions(source, inn)

    const documents = data.map(item => {



        return {
            name: item.original_filename,
            filename: item.original_filename + "." + item.new_filename.split('.').pop()?.toLowerCase(),
            url: `${DIR_FILE_STORE}/${item.new_filename}`
        }
    })

    response.status(200).json(documents)
}


export
function  saveInteraction(request, response) {
    const { source, inn, type } = request.params

}