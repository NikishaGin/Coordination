const getTextWidthHeuristic = str => {
    let width = 0;

    for (let char of str) {
        if ("W@#".includes(char))         width += 1.5;
        else if ("il.'| ".includes(char)) width += 0.5;
        else width += 1;
    }

    return width;
};


const MAX_COL_WIDTH = 50;
const MIN_COL_WIDTH = 10;

export const setColumnWidths = (worksheet, header, data) => {
    if (!(worksheet && header)) return;

    const headerKeys = Object.keys(header);
    const headerValues = Object.values(header);
    const allRows = [
        Object.fromEntries(headerKeys.map(key => [header[key], header[key]])), // заголовки
        ...data.map(row => {
            const renamed = {};
            for (const [oldKey, newKey] of Object.entries(header)) {
                renamed[newKey] = row[oldKey] ?? "";
            }
            return renamed;
        }),
    ];

    const colWidths = headerValues.map(colName => {
        let maxLength = colName.length;
        for (const row of allRows) {
            const val = row[colName];
            const len = getTextWidthHeuristic(val != null ? String(val) : "");
            if (len > maxLength) maxLength = len;
        }
        return {
            wch: Math.max(MIN_COL_WIDTH, Math.min(Math.ceil(maxLength * 1.1), MAX_COL_WIDTH))
        };
    });

    worksheet["!cols"] = colWidths;
};