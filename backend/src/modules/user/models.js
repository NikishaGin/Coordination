import db from "../../connection.js";


export function getUser(login) {
    return db("users").where({ username: login }).first([
        "id",
        "password as passwordHash",
        "name as firstname",
        "surname as secondname",
        "patronymic as lastname",
        "region as regionCode",
        "role"
    ])
}


export function getServiceMode() {
    return db("settings").first("value")
}


export function setServiceMode(value) {
    return  db("settings").update({ value })
}