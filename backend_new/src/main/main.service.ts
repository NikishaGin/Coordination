import { Injectable } from '@nestjs/common';
import { ClientCategories, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AmountsType, GetMainParamsDto, RegionType } from './main.dto';
import { getStatusIP } from '../common/utils/getStatusIP';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class MainService {
    constructor(private prisma: PrismaService) {}

    createClientFilter(data: GetMainParamsDto): Prisma.ResolutionsListRelationFilter {
        const logicalOperator: 'OR' | 'AND' = data.isArchived ? 'OR' : 'AND';
        const isExistsDate: Partial<{ not: null; equals: null }> = data.isArchived
            ? { not: null }
            : { equals: null };
        const filterIsArchived: Prisma.ResolutionsWhereInput = {
            [logicalOperator]: [
                { isArchived: data.isArchived },
                { WritExecutionEndDate: isExistsDate },
                { WritExecutionTerminateDate: isExistsDate },
            ],
        };
        return {
            some: {
                isVisible: true,
                isDerived: data.isDerived,
                ...(!data.isArchived ? filterIsArchived : {}),
            },
            every: {
                ...(data.isArchived ? filterIsArchived : {}),
            },
        };
    }

    getRegions(data: GetMainParamsDto): Promise<RegionType[]> {
        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data),
        };
        return this.prisma.regions.findMany({
            omit: { sonoName: true },
            where: {
                tno: {
                    some: {
                        client: {
                            some: filter,
                            every: { isVisible: true },
                        },
                    },
                },
            },
        });
    }

    getClientCategories(data: GetMainParamsDto): Promise<ClientCategories[]> {
        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data),
            ...(data?.regionId ? { tno: { regionId: data.regionId } } : {}),
        };
        return this.prisma.clientCategories.findMany({
            where: {
                client: {
                    some: filter,
                    every: { isVisible: true },
                },
            },
        });
    }

    async getStatusesIP(data: GetMainParamsDto): Promise<string[]> {
        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data),
            ...(data?.regionId ? { tno: { regionId: data.regionId } } : {}),
        };

        const clients = await this.prisma.clients.findMany({
            where: {
                isVisible: true,
                ...filter,
            },
            select: { id: true },
        });

        const clientIds: number[] = clients.map(({ id }: { id: number }): number => id);

        return this.prisma.$queryRaw<string[]>(
            Prisma.sql`
                SELECT DISTINCT CASE
                                    WHEN countStopDate > 0 THEN "Окончено"
                                    WHEN countEndDate > 0 THEN "Приостановлено"
                                    WHEN countPostponementDate > 0 THEN "Отложено"
                                    WHEN countTerminateDate > 0 THEN "Прекращено"
                                    ELSE "На исполнении"
                                    END
                FROM (SELECT COUNT(r.WritExecutionStopDate)         AS countStopDate,
                             COUNT(r.WritExecutionEndDate)          AS countEndDate,
                             COUNT(r.WritExecutionPostponementDate) AS countPostponementDate,
                             COUNT(r.WritExecutionTerminateDate)    AS countTerminateDate
                      FROM resolutions r
                      WHERE r.clientIs IN (${Prisma.join(clientIds)})
                        AND r.isDerived = ${data.isDerived}
                        AND r.isArchived = ${data.isArchived}
                        AND r.isVisible = 1
                      GROUP BY r.clientId)
            `,
        );
    }

    async getClients(data: GetMainParamsDto, role: Role): Promise<any> {
        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data),
            ...(data?.regionId ? { tno: { regionId: data.regionId } } : {}),
        };

        const clients = await this.prisma.clients.findMany({
            where: {
                isVisible: true,
                ...filter,
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

        const clientIds: number[] = clients.map(({ id }: { id: number }): number => id);

        const resolutionPromise = this.prisma.resolutions.groupBy({
            by: ['clientId'],
            where: {
                clientId: { in: clientIds },
                isDerived: data.isDerived,
                isArchived: data.isArchived,
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

        const activeAmountsPromise = this.prisma.$queryRaw<AmountsType[]>(
            Prisma.sql`
                SELECT actives.clientId,
                       SUM(
                           IF(
                               (wanteds.endDate IS NOT NULL) AND (wanteds.result = 'END_PROPERTY_SEARCH_ACTIVITIES'),
                               0,
                               actives.cost
                           )
                               
                       )                                             AS totalSum,
                       SUM(arrests.amount)                           AS arrest,
                       SUM(
                            IF(
                               (wanteds.beginDate IS NOT NULL) AND (wanteds.endDate IS NULL), 
                               actives.cost,
                               0
                           )
                       )                                             AS wanted,                       
                       SUM(evaluations.amount)                       AS evaluation,
                       SUM(realizationFirst.submitAmount)            AS realizationFirst,
                       SUM(realizationSecond.submitAmount)           AS realizationSecond,
                       SUM(realizationSecond.realizedPropertyAmount) AS realizationResult,
                       SUM(refund_property.amount)                   AS refundProperty,
                       SUM(debit_foreclosure.requestAmount)          AS debitForeclosure
                FROM actives
                         LEFT JOIN arrests ON actives.id = arrests.activeId
                         LEFT JOIN wanteds ON actives.id = wanteds.activeId                    
                         LEFT JOIN evaluations ON actives.id = evaluations.activeId
                         LEFT JOIN realizations AS realizationFirst
                                   ON
                                       realizationFirst.id = evaluations.activeId
                                           AND
                                       realizationFirst.stage = 'FIRST'
                         LEFT JOIN realizations AS realizationSecond
                                   ON
                                       realizationSecond.id = evaluations.activeId
                                           AND
                                       realizationSecond.stage = 'SECOND'
                         LEFT JOIN refund_property ON actives.id = refund_property.activeId
                         LEFT JOIN debit_foreclosure ON actives.id = debit_foreclosure.activeId
                WHERE actives.clientId IN (${Prisma.join(clientIds)})
                  AND actives.isVisible = 1
                GROUP BY actives.clientId
            `,
        );

        const interactionsPromise = this.prisma.interactions.groupBy({
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

        const [resolutionsData, activeAmounts, interactionsData] = await Promise.all([
            resolutionPromise,
            activeAmountsPromise,
            interactionsPromise,
        ]);

        for (const client of clients) {
            const resolution = resolutionsData.find(
                (item): boolean => item.clientId === client.id,
            )!;
            const amounts = activeAmounts.find(
                (item: AmountsType): boolean => item.clientId === client.id,
            )!;
            const interaction = interactionsData.find(
                (item): boolean => item.clientId === client.id,
            )!;

            client['amounts'] = {
                resolutionAmount: resolution._sum.amount,
                resolutionBalance: resolution._sum.balance,
                ...amounts,
                clientId: undefined,
            };

            client['statusIP'] = getStatusIP(resolution._count);

            /*
            if (interaction._count.submissionDate + interaction._count.originalFilename_1 > 0)
                client['interactionWithGMU'] =
                    role === Role.limitedAdminGMU
                        ? 'Получено сообщение от МИУДОЛ'
                        : 'Получен ответ от ГМУ';
            else if (
                interaction._count.reviewDate +
                interaction._count.result +
                interaction._count.originalFilename_2 > 0
            )
                client['interactionWithGMU'] = 'Отправлено';
            else client['interactionWithGMU'] = '';
             */

            // resolution._min.WritExecutionBeginDate
            // client[indicators] = ''
        }
        return clients;
    }
}
