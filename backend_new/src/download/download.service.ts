import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MainService } from '../main/main.service';
import { ExcelService } from './excel/excel.service';
import { GetDownloadParamsDto } from './download.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class DownloadService {
    constructor(
        private prisma: PrismaService,
        private excel: ExcelService,
        private main: MainService,
    ) {}

    async getCommonStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Workbook> {
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

    async getResolutionsStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Workbook> {
        const filter = {
            id,
            resolution: this.main.createClientFilter(),
        };
        this.prisma.clients.findMany({
            where: {
                isVisible: true,
                ...filter,
            },
            omit: {
                isVisible: true,
                id: true,
                categoryId: true,
                tnoId: true,
                sospId: true,
            },
            include: {
                tno: { include: { region: true } },
                resolution: true,
            },
        });
    }

    async getActivesStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Workbook> {}
}
