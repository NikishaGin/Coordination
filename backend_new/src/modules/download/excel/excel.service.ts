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
        // const numFmt = options.columns.map(({ numFmt }) => numFmt)
        if (options.data.length > 0) {
            options.data.forEach((rowData) => {
                // доп обработка

                this.extractRowValues(rowData, options.columns);
            });
        }
        this.applySheetStyles(worksheet);
    }

    private extractRowValues(rowData, columns: ExcelColumnOptions[]) {
        const extract = (current, key: string) => {
            return current && current[key] ? current[key] : null;
        };
        return columns.map((column) => {
            if (!column.key) return undefined;
            const transform = value => column.isNumber ? Number(value) : value;
            const value = column.key.split('.').reduce(extract, rowData);
            return value ? transform(value) : '';
        });
    }

    private applySheetStyles(
        worksheet: ExcelJS.Worksheet,
    ): void {
        worksheet.views = [
            {
                state: 'frozen',
                ySplit: 1,
            }
        ];

        worksheet.columns.forEach((column, index) => {
            column.width = 40;

            // if (numFmt[index] !== undefined) {
            //     column.numFmt = numFmt[index];
            // }

        });

        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };

                cell.alignment = {
                    vertical: 'middle',
                    horizontal: (rowNumber === 1) ? 'center' : 'left',
                    wrapText: true,
                };

                if (rowNumber === 1) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {argb: '082950FA'},
                    };

                    cell.font = {
                        bold: true,
                        color: { argb: 'FFFFFF' },
                        size: 12,
                    };
                }
            });
        });

    }
}
