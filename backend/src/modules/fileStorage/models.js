import db from "../../connection.js";



export function getDocuments(source) {
    return db("library").select("*").where({ source })
}


export function saveDocument(data) {
    return db("library").insert(data)
}