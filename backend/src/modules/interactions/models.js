import db from "../../connection.js";



export function getInteractions(source, inn) {
    return db("interactions").select("*").where({ source, inn })
}


export function saveInteraction() {
    return
}