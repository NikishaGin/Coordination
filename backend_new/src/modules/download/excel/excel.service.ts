import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ExcelColumnOptions, ExcelOptions, ExcelSheetOptions } from './excel.interface';

@Injectable()
export class ExcelService {
    createExcelWorkbook(options: ExcelOptions): Promise<ExcelJS.Buffer> {
        const workbook = new ExcelJS.Workbook();
        options.sheets.forEach((sheet: ExcelSheetOptions) => {
            this.addSheet(workbook, sheet);
        });
        return workbook.xlsx.writeBuffer();
    }

    private addSheet(workbook: ExcelJS.Workbook, options: ExcelSheetOptions) {
        const worksheet = workbook.addWorksheet(options.name);
        worksheet.columns = options.columns;
        const numberRows = options.data.length;
        const numberColumns = options.columns.length;
        const numFmt = options.columns.map(({ numFmt }) => numFmt)
        if (numberRows > 0) {
            options.data.forEach((rowData) => {
                // доп обработка

                const rowValues = this.extractRowValues(rowData, options.columns);
                const row = worksheet.addRow(rowValues);

                // row.getCell()
            });
        }
        this.applySheetStyles(worksheet, numFmt, numberRows, numberColumns);
    }

    private extractRowValues(rowData, columns: ExcelColumnOptions[]) {
        const extract = (current, key: string) => {
            return current && current[key] ? current[key] : null;
        };
        return columns.map((column) => {
            if (!column.key) return undefined;
            const transform = value => column.numFmt ? Number(value) : value;
            const value = column.key.split('.').reduce(extract, rowData);
            return value ? transform(value) : '';
        });
    }

    private applySheetStyles(
        worksheet: ExcelJS.Worksheet,
        numFmt: (string | undefined)[],
        numberRows: number,
        numberColumns: number,
    ): void {
        // Стиль для заголовков
        const headerRow = worksheet.getRow(1);
        headerRow.font = {
            bold: true,
            color: { argb: 'FFFFFF' },
            size: 12,
        };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' },
        };
        headerRow.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
        };


        worksheet.views = [
            {
                state: 'frozen',
                ySplit: 1,
            }
        ];

        // Автоподбор ширины столбцов
        worksheet.columns.forEach((column, index) => {
            column.width = 40;
            if (numFmt[index] !== undefined) {
                column.numFmt = numFmt[index];
            }
        });


        // Границы для всех ячеек
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };


                cell.alignment = {
                    vertical: 'top',
                    wrapText: true,
                };
            });
        });

    }
}
