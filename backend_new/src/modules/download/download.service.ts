import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from './excel/excel.service';
import { AggregatedStatisticsService } from "../aggregated-statistics/aggregated-statistics.service";
import { CalculatedActualValuesService } from "../core/services/calculated-actual-values.service";
import { IndicatorsService } from "../core/services/indicators.service";
import { Prisma } from '../../generated/prisma/client';
import * as ExcelJS from 'exceljs';
import { ExcelColumnOptions, ExcelSheetOptions } from './excel/excel.interface';
import { GetDownloadParamsDto } from './download.dto';
import { createServiceFilters } from '../../common/utils/ServiceFilters';
import { getValueFromMap } from "../../common/utils/data-transform";
import { HEADERS_ACTIVES_STATISTICS, HEADERS_COMMON_STATISTICS, HEADERS_RESOLUTIONS_STATISTICS } from './download.headers';
import { ActivesType, LeasStatus, WantedResults } from '../../generated/prisma/enums';
import { STATUS_TYPE, VERIFICATION_STATUS, WANTED_STATUS } from "../../constants";



@Injectable()
export class DownloadService {
    constructor(
        private prisma: PrismaService,
        private excel: ExcelService,
        private stats: AggregatedStatisticsService,
        private calculatedValues: CalculatedActualValuesService,
        private indicators: IndicatorsService,
    ) {}


    generateNameFile(prefix: string, isDerived: boolean, isArchived: boolean): string {
        const source: string = isDerived ? 'производный долг' : 'взыскание по 47 ст.';
        const isArchivedSource: string = isArchived ? ', архив' : '';
        const date = new Date();
        const formatedDate = date.toLocaleDateString();
        const filename = `${prefix} (${source}${isArchivedSource}) от ${formatedDate}.xlsx`;
        return encodeURIComponent(filename);
    }


    async getCommonStatistics(data: GetDownloadParamsDto): Promise<ExcelJS.Buffer> {
        const { clientsFilter, resolutionsFilter } = createServiceFilters(data.isDerived, data.isArchived);
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
        const { clientsFilter, resolutionsFilter } = createServiceFilters(data.isDerived, data.isArchived);
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
            resolution['statusIP'] = this.calculatedValues.getStatusIP({
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
        const { clientsFilter, resolutionsFilter } = createServiceFilters(data.isDerived, data.isArchived);
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

                active['objectStatusText'] = this.calculatedValues.getObjectStatus(active.objectStatus, active.otherObjectStatus);

                active['isVerifiedText'] = getValueFromMap(active.isVerified, VERIFICATION_STATUS);

                if (active.wanted)
                    active.wanted['resultText'] = getValueFromMap(active.wanted.result, WANTED_STATUS);

                if (active.realization && active.realization.length > 0) {
                    const realization = this.calculatedValues.destructuringRealization(active.realization);
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
