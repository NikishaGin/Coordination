import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CalculatedActualValuesService } from "../core/services/calculated-actual-values.service";
import { IndicatorsService } from "../core/services/indicators.service";
import { Prisma } from "../../generated/prisma/client";
import { queryAggregatedActives } from "./aggregated-statistics.query";
import { CommonStatisticsType } from "../download/download.type";
import { AggregatedActivesType, AggregatedIndicatorsType, ClientsType } from "./aggregated-statistics.type";
import { ActivesType, InteractionType } from "../../generated/prisma/enums";
import { DEADLINES } from "../../constants";



@Injectable()
export class AggregatedStatisticsService {
    constructor(
        private prisma: PrismaService,
        private calculatedValues: CalculatedActualValuesService,
        private indicators: IndicatorsService,
    ) {}

    private deleteUnnecessaryKey(active: AggregatedActivesType | undefined) {
        return active && {
            ...active,
            lastUploadDate: undefined,
            isLeasing: undefined,
            isArrestedAllActives: undefined,
            isNoArrestedActives: undefined,
        };
    }

    private getClients(clientsFilter: Prisma.ClientsWhereInput) {
        return this.prisma.clients.findMany({
            where: clientsFilter,
            omit: {
                tnoId: true,
                sospId: true,
                categoryId: true,
                isVisible: true,
            },
            include: {
                tno: { select: { CodeTNO: true, region: true } },
                sosp: { select: { CodeSOSP: true } },
                category: true,
            },
            orderBy: [{ inn: 'asc' }],
        });
    }

    private getAggregatedActives(clientIds: number[], isStatistics: boolean) {
        const getAggregatedActivesByIncluding = (
            includeActives: boolean,
            includeDebit: boolean,
        ) => {
            let additionalCondition: Prisma.Sql;
            if (includeActives && !includeDebit)
                additionalCondition = Prisma.sql`
                AND actives.type <> ${ActivesType.DEBIT}
                `;
            else if (!includeActives && includeDebit)
                additionalCondition = Prisma.sql`
                AND actives.type = ${ActivesType.DEBIT}
                `;
            else additionalCondition = Prisma.sql``;

            return this.prisma.$queryRaw<AggregatedActivesType[]>(
                queryAggregatedActives(clientIds, additionalCondition),
            );
        }

        if (isStatistics) {
            const map = ([COMMON, ACTIVE, DEBIT]: any[]) => ({ COMMON, ACTIVE, DEBIT });
            return Promise.all([
                getAggregatedActivesByIncluding(true, true),
                getAggregatedActivesByIncluding(true, false),
                getAggregatedActivesByIncluding(false, true),
            ]).then(map);
        } else
            return getAggregatedActivesByIncluding(true, true);
    }

    private getResolutions(
        clientIds: number[],
        resolutionsFilter: Prisma.ResolutionsWhereInput,
    ) {
        return this.prisma.resolutions.groupBy({
            by: ['clientId'],
            where: {
                clientId: { in: clientIds },
                ...resolutionsFilter,
            },
            _count: {
                WritExecutionStopDate: true,
                WritExecutionEndDate: true,
                WritExecutionPostponementDate: true,
                WritExecutionTerminateDate: true,
            },
            _sum: {
                amount: true,
                balance: true,
            },
            _min: {
                WritExecutionBeginDate: true,
            },
        });
    }

    private getInteractions(clientIds: number[], type: InteractionType) {
        return this.prisma.interactions.groupBy({
            by: ['clientId'],
            where: {
                clientId: { in: clientIds },
                type,
            },
            _count: {
                submissionDate: true,
                reviewDate: true,
                result: true,
                originalFilename_1: true,
                originalFilename_2: true,
            },
        });
    }

    private getAggregatedIndicators(
        clientId: number,
        lastUploadDate: Date | null | undefined,
        isLeasing: boolean | undefined,
        writExecutionBeginDate: Date | null | undefined,
    ): AggregatedIndicatorsType {

        /*
        this.prisma.actives.aggregate({
            where: {}
        })
         */

        // this.indicators

        const currDate = new Date();
        const lastDate = new Date(lastUploadDate || 0);

        return {
            isUpdated: currDate.getTime() - lastDate.getTime() <= DEADLINES.WEEK,
            isLeasing: Boolean(isLeasing),
        };
    }



    async getCommonStatistics(
        clientsFilter: Prisma.ClientsWhereInput,
        resolutionsFilter: Prisma.ResolutionsWhereInput,
    ): Promise<ClientsType<'CommonStats'>[]> {
        const clients = await this.getClients(clientsFilter) as ClientsType<'CommonStats'>[];
        const clientIds: number[] = clients.map(({ id }): number => id);

        const resolutionPromise = this.getResolutions(clientIds, resolutionsFilter);

        const aggregatedActivesPromise = this.getAggregatedActives(
            clientIds,
            true
        ) as Promise<CommonStatisticsType<AggregatedActivesType[]>>;

        const [resolutions, aggregatedActives] = await Promise.all([
            resolutionPromise,
            aggregatedActivesPromise,
        ]);

        for (const client of clients) {
            const resolution = resolutions.find(
                (item): boolean => item.clientId === client.id,
            );

            const active: CommonStatisticsType<AggregatedActivesType | undefined> = {
                COMMON: aggregatedActives.COMMON.find((item): boolean => item.clientId === client.id),
                ACTIVE: aggregatedActives.ACTIVE.find((item): boolean => item.clientId === client.id),
                DEBIT: aggregatedActives.DEBIT.find((item): boolean => item.clientId === client.id),
            };

            client.amounts = {
                resolution: {
                    amount: resolution?._sum?.amount || null,
                    balance: resolution?._sum?.balance || null,
                },
                active: {
                    COMMON: this.deleteUnnecessaryKey(active.COMMON),
                    ACTIVE: this.deleteUnnecessaryKey(active.ACTIVE),
                    DEBIT: this.deleteUnnecessaryKey(active.DEBIT),
                },
            };

            client.securingArrest = {
                COMMON: this.calculatedValues.getSecuringArrest(active?.COMMON, resolution?._sum?.balance),
                ACTIVE: this.calculatedValues.getSecuringArrest(active?.ACTIVE, resolution?._sum?.balance),
                DEBIT: this.calculatedValues.getSecuringArrest(active?.DEBIT, resolution?._sum?.balance),
            };
            client.statusIP = this.calculatedValues.getStatusIP(resolution?._count);
        }

        return clients;
    }


    async getMainData(
        clientsFilter: Prisma.ClientsWhereInput,
        resolutionsFilter: Prisma.ResolutionsWhereInput,
        isGMU: boolean,
    ): Promise<ClientsType<'Simple'>[]> {
        const clients = await this.getClients(clientsFilter) as ClientsType<'Simple'>[];
        const clientIds: number[] = clients.map(({ id }): number => id);

        const resolutionPromise = this.getResolutions(clientIds, resolutionsFilter);

        const aggregatedActivesPromise = this.getAggregatedActives(
            clientIds,
            false
        ) as Promise<AggregatedActivesType[]>;

        const interactionsPromise = this.getInteractions(clientIds, InteractionType.GMU);

        const [resolutions, aggregatedActives, interactions] = await Promise.all([
            resolutionPromise,
            aggregatedActivesPromise,
            interactionsPromise,
        ]);

        for (const client of clients) {
            const resolution = resolutions.find(
                (item): boolean => item.clientId === client.id,
            );

            const active: AggregatedActivesType | undefined = aggregatedActives.find(
                (item): boolean => item.clientId === client.id
            );

            const interaction = interactions.find(
                (item): boolean => item?.clientId === client.id,
            );

            client.amounts = {
                resolution: {
                    amount: resolution?._sum?.amount || null,
                    balance: resolution?._sum?.balance || null,
                },
                active: this.deleteUnnecessaryKey(active),
            }

            client.securingArrest = this.calculatedValues.getSecuringArrest(active, resolution?._sum?.balance);
            client.statusIP = this.calculatedValues.getStatusIP(resolution?._count);
            client.interaction = {
                GMU: this.calculatedValues.getInteractionStatusWithGMU(interaction?._count, isGMU)
            };
            const { lastUploadDate, isLeasing } = active || {};
            const { WritExecutionBeginDate } = resolution?._min || {};
            client.indicators = this.getAggregatedIndicators(client.id, lastUploadDate, isLeasing, WritExecutionBeginDate);
        }
        return clients;
    }
}
