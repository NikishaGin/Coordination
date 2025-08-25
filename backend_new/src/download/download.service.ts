import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MainService } from '../main/main.service';
import { ExcelService } from './excel/excel.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class DownloadService {
    constructor(
        private prisma: PrismaService,
        private excel: ExcelService,
        private main: MainService,
    ) {}

    async getStatistics(): Promise<ExcelJS.Workbook> {
        // this.main.getClients()
        return this.excel.createExcelWorkbook({
            sheets: [
                {
                    name: 'Статистика',
                    data: [],
                    columns: [{ header: '', key: '' }],
                },
                {
                    name: 'Статистика по активам',
                    data: [],
                    columns: [{ header: '', key: '' }],
                },
                {
                    name: 'Статистика по дебиторской задолженности',
                    data: [],
                    columns: [{ header: '', key: '' }],
                },
            ],
        });
    }

    async getStatisticsIP(): Promise<ExcelJS.Workbook> {
        this.prisma.clients.findMany({
            where: {},
        });
    }

    async getActiveStatistics(): Promise<ExcelJS.Workbook> {}
}
