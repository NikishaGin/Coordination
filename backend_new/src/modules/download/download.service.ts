import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {AggregatedStatisticsService} from "../aggregated-statistics/aggregated-statistics.service";
import { ExcelService } from './excel/excel.service';
import { ExcelColumnOptions, ExcelSheetOptions } from './excel/excel.interface';
import { GetDownloadParamsDto } from './download.dto';
import * as ExcelJS from 'exceljs';
import { Prisma } from '../../generated/prisma/client';
import { createDataFilters } from '../../common/utils/ResolutionsFilter';
import { HEADERS_ACTIVES_STATISTICS, HEADERS_COMMON_STATISTICS, HEADERS_RESOLUTIONS_STATISTICS } from './download.headers';
import { ActivesType, LeasStatus, WantedResults } from '../../generated/prisma/enums';
import {STATUS_TYPE, VERIFICATION_STATUS, WANTED_STATUS} from "../../common/constants";
import {
    getValueFromMap,
    getObjectStatus,
    destructuringRealization,
    getStatusIP
} from "../../common/utils/calculatedActualValues";

@Injectable()
export class DownloadService {
    constructor(
        private prisma: PrismaService,
        private excel: ExcelService,
        private stats: AggregatedStatisticsService,
    ) {}

    generateNameFile(prefix: string, isDerived: boolean, isArchived: boolean): string {
        const source: string = isDerived ? ' производного долга' : ' взыскания по 47 ст.';
        const isArchivedSource: string = isArchived ? 'архива' : '';
        const date = new Date();
        const formatedDate = date.toLocaleString();
        const filename = `${prefix} ${isArchivedSource}${source} (${formatedDate}).xlsx`;
        return encodeURIComponent(filename);
    }

    async getCommonStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        const { clientsFilter, resolutionsFilter } = createDataFilters(data.isDerived, data.isArchived);
        if (data.clientIds)
            clientsFilter.id = { in: data.clientIds };

        const statistics = await this.stats.getCommonStatistics(clientsFilter, resolutionsFilter);
        const HEADERS = HEADERS_COMMON_STATISTICS(data.isDerived);

        return this.excel.createExcelWorkbook({
            sheets: [
                {
                    name: 'Статистика',
                    data: statistics,
                    columns: HEADERS.COMMON,
                },
                {
                    name: 'Статистика по активам',
                    data: statistics,
                    columns: HEADERS.ACTIVE,
                },
                {
                    name: 'Статистика по дебит. задолж.',
                    data: statistics,
                    columns: HEADERS.DEBIT,
                },
            ],
        });
    }

    async getResolutionsStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        const { clientsFilter, resolutionsFilter } = createDataFilters(data.isDerived, data.isArchived);
        if (data.clientIds)
            clientsFilter.id = { in: data.clientIds };

        const resolutions = await this.prisma.resolutions.findMany({
            where: {
                ...resolutionsFilter,
                client: clientsFilter,
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
        const { clientsFilter, resolutionsFilter } = createDataFilters(data.isDerived, data.isArchived);
        if (data.clientIds)
            clientsFilter.id = { in: data.clientIds };

        const resolutions = await this.prisma.resolutions.groupBy({
            by: ['clientId'],
            where: {
                ...resolutionsFilter,
                client: clientsFilter,
            },
            _sum: { amount: true, balance: true },
        });

        const clientIds: number[] = resolutions.map(({ clientId }): number => clientId);

        const getSheet = async (
            name: string,
            type: ActivesType,
            additionalActiveFilter: Prisma.ActivesWhereInput | undefined = undefined,
        ): Promise<ExcelSheetOptions> => {
            const headerKey: string = type === ActivesType.GROUND ? ActivesType.PROPERTY : type;
            const columns: ExcelColumnOptions[] = HEADERS_ACTIVES_STATISTICS[headerKey];

            const actives = await this.prisma.actives.findMany({
                where: {
                    client: { id: { in: clientIds } },
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
                            tno: { select: { CodeTNO: true, region: true } },
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

                active['statusText'] = getValueFromMap(active.status, STATUS_TYPE);

                active['objectStatusText'] = getObjectStatus(active.objectStatus, active.otherObjectStatus);

                active['isVerifiedText'] = getValueFromMap(active.isVerified, VERIFICATION_STATUS);

                if (active.wanted)
                    active.wanted['resultText'] = getValueFromMap(active.wanted.result, WANTED_STATUS);

                if (active.realization) {
                    const realization = destructuringRealization(active.realization);
                    active['realizationFirst'] = realization.realizationFirst;
                    active['realizationSecond'] = realization.realizationSecond;
                }
            }

            return { name, columns, data: actives };
        };

        const sheets = await Promise.all([
            getSheet('Транспорт', ActivesType.TRANSPORT),
            getSheet('Транспорт (залог. не ФНС)', ActivesType.TRANSPORT, {
                isLeasing: LeasStatus.IS_NOT_PLEDGE_HOLDER,
            }),
            getSheet('Транспорт (прекращение розыска)', ActivesType.TRANSPORT, {
                wanted: {
                    endDate: { not: null },
                    result: { equals: WantedResults.END_PROPERTY_SEARCH_ACTIVITIES },
                }
            }),

            getSheet('Недвижимость', ActivesType.PROPERTY),
            getSheet('Недвижимость (залог. не ФНС)', ActivesType.PROPERTY, {
                isLeasing: LeasStatus.IS_NOT_PLEDGE_HOLDER,
            }),

            getSheet('Земельные уч.', ActivesType.GROUND),
            getSheet('Земельные уч. (залог. не ФНС)', ActivesType.GROUND, {
                isLeasing: LeasStatus.IS_NOT_PLEDGE_HOLDER,
            }),

            getSheet('Дебиторская задолженность', ActivesType.DEBIT),

            getSheet('Иные активы', ActivesType.OTHER),
            getSheet('Иные активы (залог. не ФНС)', ActivesType.OTHER, {
                isLeasing: LeasStatus.IS_NOT_PLEDGE_HOLDER,
            }),
        ]);

        return this.excel.createExcelWorkbook({ sheets });
    }
}
