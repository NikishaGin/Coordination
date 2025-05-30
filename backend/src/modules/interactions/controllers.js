import crypto from "crypto"
import fs from "fs";
import { interactions } from "../../queries/selectors.js"


const DIR_FILE_STORE = "./FileStore/Interactions"
if (!fs.existsSync(DIR_FILE_STORE))
    fs.mkdirSync(DIR_FILE_STORE, { recursive: true })



export async function getInteractions(request, response) {
    const { source, inn } = request.params
    const data = await interactions.getInteractions(source, inn)


    response.status(200).json(data)
}


export
function  saveInteraction(request, response) {
    const { source, inn, type } = request.params

}