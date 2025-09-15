import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {Prisma} from "../../generated/prisma/client";
import {ActivesType, InteractionType} from "../../generated/prisma/enums";
import {AggregatedActivesType, ClientsType, SelectType} from "./aggregated-statistics.type";
import { queryAggregatedActives } from "./aggregated-statistics.query";
import {CommonStatisticsType} from "../download/download.type";
import {getInteractionStatusWithGMU, getSecuringArrest, getStatusIP} from "../../common/utils/calculatedActualValues";
import {DEADLINES} from "../../common/constants";

@Injectable()
export class AggregatedStatisticsService {
    constructor(private prisma: PrismaService) {}

    private getClients(clientFilter: Prisma.ClientsWhereInput) {
        return this.prisma.clients.findMany({
            where: {
                isVisible: true,
                ...clientFilter,
            },
            omit: {
                tnoId: true,
                sospId: true,
                categoryId: true,
                isVisible: true,
            },
            include: {
                tno: { select: { CodeTNO: true } },
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
                isVisible: true,
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


    async getCommonStatistics(
        clientFilter: Prisma.ClientsWhereInput,
        resolutionsFilter: Prisma.ResolutionsWhereInput,
    ): Promise<ClientsType<'CommonStats'>[]> {
        const clients = await this.getClients(clientFilter) as ClientsType<'CommonStats'>[];
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
                active,
            };

            client.securingArrest = {
                COMMON: getSecuringArrest(active?.COMMON, resolution?._sum?.balance),
                ACTIVE: getSecuringArrest(active?.ACTIVE, resolution?._sum?.balance),
                DEBIT: getSecuringArrest(active?.DEBIT, resolution?._sum?.balance),
            };
            client.statusIP = getStatusIP(resolution?._count);
        }

        return clients;
    }


    async getMainData(
        clientFilter: Prisma.ClientsWhereInput,
        resolutionsFilter: Prisma.ResolutionsWhereInput,
        isGMU: boolean,
    ): Promise<ClientsType<'Simple'>[]> {
        const clients = await this.getClients(clientFilter) as ClientsType<'Simple'>[];
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
                active,
            }

            client.securingArrest = getSecuringArrest(active, resolution?._sum?.balance);
            client.statusIP = getStatusIP(resolution?._count);
            client.interaction = {
                GMU:getInteractionStatusWithGMU(interaction?._count, isGMU)
            };

            const { lastUploadDate, countIsLeasing } = client.amounts.active || {};
            const currDate = new Date();
            const lastDate = new Date(lastUploadDate || 0);
            client.indicators = {
                isUpdated: currDate.getTime() - lastDate.getTime() <= DEADLINES.WEEK,
                isLeasing: (countIsLeasing || 0) > 0,
            };

            // resolution._min.WritExecutionBeginDate
        }

        return clients;
    }
}