import XLSX from "xlsx-js-style"


const headerStyle = {
    font: { bold: true, italic: true, sz: 14 },
    fill: { fgColor: { rgb: "D3D3D3" } },
    alignment: { horizontal: "center" }
}

const borderStyle = {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } }
}



export function createSheet(data, header) {
    const worksheet = XLSX.utils.json_to_sheet(
        data.map(row => Object.entries(header).reduce((obj, [key, newKey]) => {
            obj[newKey] = row[key] ?? ""
            return obj
        }, {}))
    )
    worksheet['!cols'] = Object.values(header).map(h => ({ wch: 1.4 * h.length + 2 }))
    const range = XLSX.utils.decode_range(worksheet['!ref'])
    for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: col })
        if (worksheet[headerCell])
            worksheet[headerCell].s = headerStyle
        for (let row = range.s.r; row <= range.e.r; row++) {
            const cell = XLSX.utils.encode_cell({ r: row, c: col })
            if (worksheet[cell]) {
                worksheet[cell].s = worksheet[cell].s || {}
                worksheet[cell].s.border = borderStyle
            }
        }
    }
    return worksheet
}


export function createAndSendTable(response, Sheets, filename) {
    const workbook = XLSX.utils.book_new()
    Object.keys(Sheets).forEach(sheetname => {
        XLSX.utils.book_append_sheet(workbook, Sheets[sheetname], sheetname)
    })
    const excel = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    response.setHeader('Content-Type', 'application/octet-stream')
    response.setHeader('Content-Disposition', `attachment filename*=UTF-8''${encodeURIComponent(filename)}`)
    response.send(excel)
}


export function getDateNow() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}