import db from "../../connection.js";


export function getInteractions(source, inn) {
    return db("interactions").select("*").where({ source, inn })
}


export async function upsertInteraction(id, fields) {
    const nullCastedEntries = Object.entries(fields).map(
        ([key, value]) => [key, (((typeof value === "string") && (value.trim() === "") || !value) ? null : value)]
    );
    const nullCastedFields = Object.fromEntries(nullCastedEntries);
    if (id) {
        await db("interactions").where({ id }).update(nullCastedFields);
        return id;
    }
    const [insertId] = await db("interactions").insert(nullCastedFields);
    return insertId;
}


export async function checkFile(id) {
    if (id)
        return await db("interactions").where({ id }).first("systemsFilename_1", "originalFilename_1", "systemsFilename_2", "originalFilename_2")
    else
        return {}
}
