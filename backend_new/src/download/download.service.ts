import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MainService } from '../main/main.service';
import { ExcelService } from './excel/excel.service';
import { ExcelColumnOptions, ExcelSheetOptions } from './excel/excel.interface';
import { GetDownloadParamsDto } from './download.dto';
import * as ExcelJS from 'exceljs';
import { getStatusIP } from '../common/utils/getStatusIP';
import { Prisma } from '../generated/prisma/client';
import { getArchivedFilter, getDerivedFilter } from '../common/utils/ResolutionsFilter';
import {
    HEADERS_ACTIVES_STATISTICS,
    HEADERS_COMMON_STATISTICS,
    HEADERS_RESOLUTIONS_STATISTICS,
} from './download.headers';
import { ActivesType, LeasStatus, ObjectStatus, RealizationStage } from '../generated/prisma/enums';
import { StatusObjectType, StatusType, WantedType } from './download.type';
import { getActionRealizationStatus } from '../common/utils/getActionRealizationStatus';

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
                    columns: HEADERS_COMMON_STATISTICS.COMMON(data.isDerived),
                },
                {
                    name: 'Статистика по активам',
                    data: statistics,
                    columns: HEADERS_COMMON_STATISTICS.ACTIVE,
                },
                {
                    name: 'Статистика по дебит. задолж.',
                    data: statistics,
                    columns: HEADERS_COMMON_STATISTICS.DEBIT,
                },
            ],
        });
    }

    async getResolutionsStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const resolutions = await this.prisma.resolutions.findMany({
            where: {
                ...this.main.createClientFilter(data.isArchived, derivedFilter, archivedFilter),
                client: {
                    isVisible: true,
                    ...(data.clientIds ? { id: { in: data.clientIds } } : {}),
                },
            },
            include: {
                client: {
                    omit: {
                        isVisible: true,
                        id: true,
                        categoryId: true,
                        tnoId: true,
                        sospId: true,
                    },
                    include: {
                        tno: { include: { region: true } },
                    },
                },
            },
        });

        for (const resolution of resolutions) {
            resolution['statusIP'] = getStatusIP({
                WritExecutionEndDate: resolution.WritExecutionEndDate,
                WritExecutionStopDate: resolution.WritExecutionStopDate,
                WritExecutionPostponementDate: resolution.WritExecutionPostponementDate,
                WritExecutionTerminateDate: resolution.WritExecutionTerminateDate,
            });
        }
        return this.excel.createExcelWorkbook({
            sheets: [
                {
                    name: 'Статистика',
                    data: resolutions,
                    columns: HEADERS_RESOLUTIONS_STATISTICS(data.isDerived),
                },
            ],
        });
    }

    async getActivesStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const filter = this.createStatisticsFilter(data, derivedFilter, archivedFilter);

        const resolutions = await this.prisma.resolutions.groupBy({
            by: ['clientId'],
            where: { client: filter },
            _sum: { amount: true, balance: true },
        });

        const getSheet = async (
            name: string,
            type: ActivesType,
            additionalActiveFilter: Prisma.ActivesWhereInput | undefined = undefined,
        ): Promise<ExcelSheetOptions> => {
            const headerKey: string = type === ActivesType.GROUND ? ActivesType.PROPERTY : type;
            const columns: ExcelColumnOptions[] = HEADERS_ACTIVES_STATISTICS[headerKey];

            const actives = await this.prisma.actives.findMany({
                where: {
                    client: {
                        isVisible: true,
                        resolution: this.main.createClientFilter(
                            data.isArchived,
                            derivedFilter,
                            archivedFilter,
                        ),
                    },
                    isVisible: true,
                    type,
                    ...(additionalActiveFilter ?? {}),
                },
                include: {
                    client: {
                        omit: {
                            isVisible: true,
                            categoryId: true,
                            tnoId: true,
                            sospId: true,
                        },
                        include: {
                            tno: { include: { region: true } },
                            category: { select: { category: true } },
                        },
                    },
                    description: true,
                    arrest: true,
                    wanted: true,
                    evaluation: true,
                    realization: true,

                    refundProperty: true,
                    debitForeclosure: true,
                    complaint: true,
                },
            });

            for (const active of actives) {
                active['resolution'] = resolutions.find(
                    (item): boolean => item.clientId === active.clientId,
                );

                active['statusText'] = active.status ? StatusType[active.status] : null;

                const objectStatus =
                    active.objectStatus === ObjectStatus.OTHER
                        ? (active.otherObjectStatus ?? '')
                        : '';
                active['objectStatusText'] = active.objectStatus
                    ? StatusObjectType[active.objectStatus] + objectStatus
                    : null;

                active['isVerifiedText'] =
                    active.isVerified !== null ? (active.isVerified ? 'Да' : 'Нет') : '';

                if (active.wanted)
                    active.wanted['resultText'] = active.wanted.result
                        ? WantedType[active.wanted.result]
                        : null;

                if (active.realization) {
                    active.realization['first'] =
                        active.realization.find(({ stage }) => stage === RealizationStage.FIRST) ||
                        {};
                    active.realization['first']['actionStatus'] = getActionRealizationStatus(
                        active.realization['first'],
                    );

                    active.realization['second'] =
                        active.realization.find(({ stage }) => stage === RealizationStage.SECOND) ||
                        {};
                    active.realization['second']['actionStatus'] = getActionRealizationStatus(
                        active.realization['second'],
                    );
                }
            }

            return { name, columns, data: actives };
        };

        const sheets = await Promise.all([
            getSheet('Транспорт', ActivesType.TRANSPORT),
            getSheet('Транспорт (залогодержатель не ФНС)', ActivesType.TRANSPORT, {
                isLeasing: LeasStatus.IS_NOT_PLEDGE_HOLDER,
            }),
            getSheet('Недвижимость', ActivesType.PROPERTY),
            getSheet('Недвижимость (залогодержатель не ФНС)', ActivesType.PROPERTY, {
                isLeasing: LeasStatus.IS_NOT_PLEDGE_HOLDER,
            }),
            getSheet('Земельные участки', ActivesType.GROUND),
            getSheet('Земельные участки (залогодержатель не ФНС)', ActivesType.GROUND, {
                isLeasing: LeasStatus.IS_NOT_PLEDGE_HOLDER,
            }),
            getSheet('Дебиторская задолженность', ActivesType.DEBIT),
            getSheet('Иные активы', ActivesType.OTHER),
            getSheet('Иные активы (залогодержатель не ФНС)', ActivesType.OTHER, {
                isLeasing: LeasStatus.IS_NOT_PLEDGE_HOLDER,
            }),
        ]);

        return this.excel.createExcelWorkbook({ sheets });
    }
}
