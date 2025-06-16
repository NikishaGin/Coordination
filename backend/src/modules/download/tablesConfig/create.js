import XLSX from "xlsx-js-style"


const mergeHeaderWithData = (data, header) => {
    const headerTitles = Object.values(header);
    const headerKeyNames = Object.keys(header);

    const reorderRow = row => headerKeyNames.map(keyName => {
        const value = row[keyName];

        if (value === null || value === undefined) {
            return "";
        }

        if (value instanceof Date) {
            return value.toISOString().split('T')[0];
        }

        if (typeof value === 'number') {
            return value.toString();
        }

        return String(value);
    });

    const aoa = [ headerTitles, ...data.map(reorderRow) ];

    return XLSX.utils.aoa_to_sheet(aoa);
};


const setMinColumnsWidth = (worksheet, {
    minWidth = 20,
    maxWidth = 40
} = {}) => {
    if (!worksheet || !worksheet['!ref']) return;

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const cols = [];

    for (let c = range.s.c; c <= range.e.c; c++) {
        let maxLength = 0;

        for (let r = range.s.r; r <= range.e.r; r++) {
            const address = XLSX.utils.encode_cell({ r, c });
            const cell = worksheet[address];

            if (!(
                [null, undefined, ''].includes(cell.v)
                || Number.isNaN(cell.v)
            )) {
                const len = cell.v.toString().trim().length;
                if (len > maxLength) maxLength = len;
            }
        }

        const leftConstraint = Math.max(maxLength, minWidth);
        const constraintsApplied = Math.min(leftConstraint, maxWidth);

        cols.push({ wch: constraintsApplied });
    }

    worksheet['!cols'] = cols;
};


const applyStylesToSheet = (worksheet, { header, body, headerHeight  = 1 } = {}) => {
    if (!(header || body)) return;

    const applyStyles = (row, col, style) => {
        const headerCell = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[headerCell]) {
            worksheet[headerCell].s = style;
        }
    };

    if (!worksheet || !worksheet['!ref']) return;
    const sheetRange = XLSX.utils.decode_range(worksheet['!ref']);

    for (let col = sheetRange.s.c; col <= sheetRange.e.c; col++) {
        for (let row = sheetRange.s.r; row <= sheetRange.e.r; row++) {
            applyStyles(row, col, row < headerHeight ? header : body);
        }
    }
};


const addColumnsNumbers = (data, header) => {
    const fakeRowEntries = Object.entries(header).map(
        ([ key, value ], ind) => ([ key, ind + 1 ])
    );

    data.unshift(Object.fromEntries(fakeRowEntries));
};


const alignment = { horizontal: 'center', vertical: 'center', wrapText: true, };

const border = { style: "thin", color: { rgb: "000000" } }
const borderStyle = {
    top:    border,
    bottom: border,
    left:   border,
    right:  border,
};

const getFont = isBold =>
    ({ name: 'Calibri', sz: 10, bold: isBold, color: { rgb: '000000' } });


const headerStyle =  {
    font: getFont(true),
    border: borderStyle,
    alignment,
};

const bodyStyle = {
    font: getFont(false),
    alignment
};


export const createSheet = (data, header) => {
    addColumnsNumbers(data, header);
    const worksheet = mergeHeaderWithData(data, header);

    setMinColumnsWidth(worksheet);
    applyStylesToSheet(worksheet,  {
        header: headerStyle,
        body: bodyStyle,
        headerHeight: 2,
    });

    return worksheet;
};


export const sendXLSXFile = (res, sheets, filename) => {
    const book = XLSX.utils.book_new()

    for (const [name, sheet] of Object.entries(sheets)) {
        XLSX.utils.book_append_sheet(book, sheet, name);
    }

    const buffer = XLSX.write(book, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    );
    res.send(buffer);
};
