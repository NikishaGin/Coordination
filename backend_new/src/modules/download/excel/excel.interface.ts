export interface ExcelColumnOptions {
    header: string;
    key: string;
    numFmt?: string;
}

export interface ExcelSheetOptions {
    name: string;
    columns: ExcelColumnOptions[];
    data: any[];
}

export interface ExcelOptions {
    filename?: string;
    sheets: ExcelSheetOptions[];
}
