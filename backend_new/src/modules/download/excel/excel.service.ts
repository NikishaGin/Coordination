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
        if (options.data.length > 0) {
            options.data.forEach((rowData) => {
                // доп обработка

                const rowValues = this.extractRowValues(rowData, options.columns);
                worksheet.addRow(rowValues);
            });
        }
        this.applySheetStyles(worksheet, options.columns);
    }

    private extractRowValues(rowData: any[], columns: ExcelColumnOptions[]) {
        const extract = (current: any, key: string) => {
            return current && current[key] ? current[key] : null;
        };
        return columns.map((column) => {
            if (!column.key) return undefined;
            const transform = value => column.isNumber ? Number(value) : value;
            const defailtValue = column.fillNull !== undefined ? column.fillNull : '';
            const value = column.key.split('.').reduce(extract, rowData);
            return value ? transform(value) : defailtValue;
        });
    }

    private applySheetStyles(worksheet: ExcelJS.Worksheet, columns: ExcelColumnOptions[]) {
        worksheet.columns = columns;

        worksheet.views = [
            {
                state: 'frozen',
                ySplit: 1,
            }
        ];

        worksheet.columns.forEach((col, indexCol) => {
            col.width = 40;
            if (columns[indexCol].isNumber)
                col.numFmt = '#,##0.00';
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
