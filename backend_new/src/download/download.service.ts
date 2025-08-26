import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MainService } from '../main/main.service';
import { ExcelService } from './excel/excel.service';
import { GetDownloadParamsDto } from './download.dto';
import * as ExcelJS from 'exceljs';
import { getStatusIP } from '../common/utils/getStatusIP';
import { GetMainParamsDto } from '../main/main.dto';
import { Prisma } from '../generated/prisma/client';
import { getArchivedFilter, getDerivedFilter } from '../common/utils/ResolutionsFilter';
import { HEADERS_COMMON_STATISTICS, HEADERS_RESOLUTIONS_STATISTICS } from './download.headers';

@Injectable()
export class DownloadService {
    constructor(
        private prisma: PrismaService,
        private excel: ExcelService,
        private main: MainService,
    ) {}

    private createStatisticsFilter(data: GetDownloadParamsDto): Prisma.ClientsWhereInput {
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        return {
            ...(data.clientIds ? { id: { in: data.clientIds } } : {}),
            ...(!data.clientIds
                ? {
                      resolution: this.main.createClientFilter(
                          data.isArchived,
                          derivedFilter,
                          archivedFilter,
                      ),
                  }
                : {}),
        };
    }

    async getCommonStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        /////////////////////// id !!!!!!!!!
        const params: GetMainParamsDto = {
            isDerived: data.isDerived,
            isArchived: data.isArchived,
        };

        return this.excel.createExcelWorkbook({
            sheets: [
                {
                    name: 'Статистика',
                    data: await this.main.getClients(params, undefined, true, {
                        includeActives: true,
                        includeDebit: true,
                    }),
                    columns: HEADERS_COMMON_STATISTICS.COMMON,
                },
                {
                    name: 'Статистика по активам',
                    data: await this.main.getClients(params, undefined, true, {
                        includeActives: true,
                        includeDebit: false,
                    }),
                    columns: HEADERS_COMMON_STATISTICS.ACTIVE,
                },
                {
                    name: 'Статистика по дебиторской задолженности',
                    data: await this.main.getClients(params, undefined, true, {
                        includeActives: false,
                        includeDebit: true,
                    }),
                    columns: HEADERS_COMMON_STATISTICS.DEBIT,
                },
            ],
        });
    }

    async getResolutionsStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        const filter = this.createStatisticsFilter(data);
        const clients = await this.prisma.clients.findMany({
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
                resolution: {
                    where: {
                        isVisible: true,
                        ...archivedFilter,
                        ...derivedFilter,
                    },
                },
            },
        });
        for (const client of clients) {
            for (const recolution of client.resolution) {
                recolution['statusIP'] = getStatusIP({
                    WritExecutionEndDate: recolution.WritExecutionEndDate,
                    WritExecutionStopDate: recolution.WritExecutionStopDate,
                    WritExecutionPostponementDate: recolution.WritExecutionPostponementDate,
                    WritExecutionTerminateDate: recolution.WritExecutionTerminateDate,
                });
            }
        }
        return this.excel.createExcelWorkbook({
            sheets: [
                {
                    name: 'Статистика',
                    data: clients,
                    columns: HEADERS_RESOLUTIONS_STATISTICS,
                },
            ],
        });
    }

    async getActivesStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        const filter = this.createStatisticsFilter(data);
        const clients = await this.prisma.clients.findMany({
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
                active: {
                    include: {
                        description: true,
                        arrest: true,
                        wanted: true,
                        evaluation: true,
                        encumbrance: true,
                        realization: true,
                        refundProperty: true,
                        debitForeclosure: true,
                        registration: true,
                        complaint: true,
                    },
                },
            },
        });
        for (const client of clients) {
            for (const active of client.active) {
                // active
            }
        }
    }
}
