export interface ExcelColumnOptions {
    header: string;
    key: string;
    isNumber?: boolean;
    fillNull?: string | number | null;
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
