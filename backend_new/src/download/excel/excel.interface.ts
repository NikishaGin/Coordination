export interface ExcelColumnOptions {
    header: string;
    key: string;
    width?: number;
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
