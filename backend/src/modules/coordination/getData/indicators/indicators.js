




export default async function (connection, regionCode) {
    let innList = await connection.query("SELECT inn FROM meta WHERE region = ?", [regionCode])
    innList = innList[0].map(item => item.inn)
    let data = {}
    for (let inn of innList) {
        data[inn] = {
            wantedMarker: 1,
            arrestMarker: 1,
            evaluationMarker: 1,
            realizationMarker: 1,
            toRealization2Marker: 1,
            realization2Marker: 1,
            forecloseMarker: 1
        }
    }
    return data
}