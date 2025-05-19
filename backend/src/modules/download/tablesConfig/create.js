import XLSX from "xlsx-js-style"


const headerStyle = {
    font: { bold: true, italic: true, sz: 14 },
    fill: { fgColor: { rgb: "D3D3D3" } },
    alignment: { horizontal: "center" }
}

const defaultBorder = { style: "thin", color: { rgb: "000000" } }
const borderStyle = {
    top:    defaultBorder,
    bottom: defaultBorder,
    left:   defaultBorder,
    right:  defaultBorder,
}


export const createSheet = (data, header) => {
    const renameKeys = (data, renames) => data.map(
        row =>  Object.fromEntries(
            Object.entries(row).map(
                ([key, value]) => [renames[key] || "", value]
            )
        )
    )

    const renamedKeysRows = renameKeys(data, header)
    const worksheet = XLSX.utils.json_to_sheet(renamedKeysRows)

    worksheet['!cols'] = Object.values(header).map(h => ({ wch: 1.4 * h.length + 2 }))

    const sheetRange = XLSX.utils.decode_range(worksheet['!ref'])

    for (let col = sheetRange.s.c; col <= sheetRange.e.c; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: col })

        if (worksheet[headerCell]) // Оно всегда существует же?
            worksheet[headerCell].s = headerStyle

        for (let row = sheetRange.s.r; row <= sheetRange.e.r; row++) {
            const cell = XLSX.utils.encode_cell({ r: row, c: col })

            if (worksheet[cell]) {
                worksheet[cell].s = worksheet[cell].s || {}
                worksheet[cell].s.border = borderStyle
            }
        }
    }

    return worksheet
}


export const sendXLSXFile = (res, sheets, filename) => {
    const book = XLSX.utils.book_new()

    for (const [name, sheet] of Object.entries(sheets)) {
        XLSX.utils.book_append_sheet(book, sheet, name)
    }

    const buffer = XLSX.write(book, { bookType: 'xlsx', type: 'buffer' })

    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader(
        'Content-Disposition',
        `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    )
    res.send(buffer)
}


export const getDateNow = () => {
    const format = arr => arr.map(
        num => String( num).padStart(2, '0')
    ).join("-")

    const now = new Date()

    const date = format([
        now.getFullYear(), now.getMonth() + 1, now.getDate()
    ])
    const stamp = format([
        now.getHours(), now.getMinutes(), now.getSeconds()
    ]);

    return date + "_" + stamp;
}