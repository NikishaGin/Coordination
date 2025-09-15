import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {Prisma} from "../../generated/prisma/client";
import {ActivesType} from "../../generated/prisma/enums";
import {ClientsType} from "./aggregated-statistics.type";


@Injectable()
export class AggregatedStatisticsService {
    constructor(private prisma: PrismaService) {}

    private getClients(
        clientFilter: Prisma.ClientsWhereInput,
    ) {
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

    private getAggregatedActives(
        clientIds: number[],
        isStatistics: boolean,
    ): Promise<ActiveDataType<AggregatedActivesType[]>> {
        const getAggregatedActivesByIncluding = (
            includeActives: boolean,
            includeDebit: boolean,
        ): Promise<AggregatedActivesType[]> => {
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
                sqlAggregatedActivesData(clientIds, additionalCondition),
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

    private getResolutions() {
        return this.prisma.resolutions.groupBy({
            by: ['clientId'],
            where: {
                clientId: { in: clientIds },
                ...derivedFilter,
                ...archivedFilter,
                isVisible: true,
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

    private getInteractions() {
        return this.prisma.interactions.groupBy({
            by: ['clientId'],
            where: {
                clientId: { in: clientIds },
                type: 'GMU',
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














    getCommonStatistics(
        clientFilter: Prisma.ClientsWhereInput
    ): Promise<ClientsType[]> {}

    getMainData(
        clientFilter: Prisma.ClientsWhereInput
    ): Promise<ClientsType[]> {}
}