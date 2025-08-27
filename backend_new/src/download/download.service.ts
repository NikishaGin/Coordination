import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MainService } from '../main/main.service';
import { ExcelService } from './excel/excel.service';
import { GetDownloadParamsDto } from './download.dto';
import * as ExcelJS from 'exceljs';
import { getStatusIP } from '../common/utils/getStatusIP';
import { Prisma } from '../generated/prisma/client';
import { getArchivedFilter, getDerivedFilter } from '../common/utils/ResolutionsFilter';
import {
    HEADERS_ACTIVES_STATISTICS,
    HEADERS_COMMON_STATISTICS,
    HEADERS_RESOLUTIONS_STATISTICS
} from './download.headers';
import { ActivesType, LeasStatus } from '../generated/prisma/enums';

@Injectable()
export class DownloadService {
    constructor(
        private prisma: PrismaService,
        private excel: ExcelService,
        private main: MainService,
    ) {}

    private createStatisticsFilter(
        data: GetDownloadParamsDto,
        derivedFilter: Prisma.ResolutionsWhereInput,
        archivedFilter: Prisma.ResolutionsWhereInput,
    ): Prisma.ClientsWhereInput {
        return {
            ...(data.clientIds ? { id: { in: data.clientIds } } : {}),
            resolution: this.main.createClientFilter(
                data.isArchived,
                derivedFilter,
                archivedFilter,
            ),
        };
    }

    async getCommonStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        const statistics = await this.main.getClients(
            {
                isDerived: data.isDerived,
                isArchived: data.isArchived,
            },
            true,
            {
                statistics: true,
                selectedClientId: data.clientIds,
            },
        );

        return this.excel.createExcelWorkbook({
            sheets: [
                {
                    name: 'Статистика',
                    data: statistics,
                    columns: HEADERS_COMMON_STATISTICS.COMMON,
                },
                {
                    name: 'Статистика по активам',
                    data: statistics,
                    columns: HEADERS_COMMON_STATISTICS.ACTIVE,
                },
                {
                    name: 'Статистика по дебиторской задолженности',
                    data: statistics,
                    columns: HEADERS_COMMON_STATISTICS.DEBIT,
                },
            ],
        });
    }

    async getResolutionsStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const filter = this.createStatisticsFilter(data, derivedFilter, archivedFilter);
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
            for (const resolution of client.resolution) {
                resolution['statusIP'] = getStatusIP({
                    WritExecutionEndDate: resolution.WritExecutionEndDate,
                    WritExecutionStopDate: resolution.WritExecutionStopDate,
                    WritExecutionPostponementDate: resolution.WritExecutionPostponementDate,
                    WritExecutionTerminateDate: resolution.WritExecutionTerminateDate,
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
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const filter = this.createStatisticsFilter(data, derivedFilter, archivedFilter);

        const getActives = (
            type: ActivesType,
            isLeasing: LeasStatus | null = null,
        ): Promise<any> =>
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
                    active: {
                        where: { type, ...(isLeasing ? { isLeasing } : {}) },
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

        /*
        for (const client of clients) {
            for (const active of client.active) {
                // active
            }
        }
         */

        return this.excel.createExcelWorkbook({
            sheets: [
                {
                    name: 'Транспорт',
                    data: await getActives(ActivesType.TRANSPORT),
                    columns: HEADERS_ACTIVES_STATISTICS.TRANSPORT,
                },
                {
                    name: 'Транспорт (залогодержатель не ФНС)',
                    data: await getActives(ActivesType.TRANSPORT, LeasStatus.IS_NOT_PLEDGE_HOLDER),
                    columns: HEADERS_ACTIVES_STATISTICS.TRANSPORT,
                },
                {
                    name: 'Недвижимость',
                    data: [],
                    columns: HEADERS_ACTIVES_STATISTICS.PROPERTY,
                },
                {
                    name: 'Недвижимость (залогодержатель не ФНС)',
                    data: [],
                    columns: HEADERS_ACTIVES_STATISTICS.PROPERTY,
                },
                {
                    name: 'Земельные участки',
                    data: [],
                    columns: HEADERS_ACTIVES_STATISTICS.GROUND,
                },
                {
                    name: 'Земельные участки (залогодержатель не ФНС)',
                    data: [],
                    columns: HEADERS_ACTIVES_STATISTICS.GROUND,
                },
                {
                    name: 'Дебиторская задолженность',
                    data: [],
                    columns: HEADERS_ACTIVES_STATISTICS.DEBIT,
                },
                {
                    name: 'Иные активы',
                    data: [],
                    columns: HEADERS_ACTIVES_STATISTICS.OTHER,
                },
                {
                    name: 'Иные активы (залогодержатель не ФНС)',
                    data: [],
                    columns: HEADERS_ACTIVES_STATISTICS.OTHER,
                },
            ],
        });
    }
}
