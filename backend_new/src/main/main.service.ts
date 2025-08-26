import { Injectable } from '@nestjs/common';
import { ClientCategories, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AmountsType, GetMainParamsDto, RegionType } from './main.dto';
import { getArchivedFilter, getDerivedFilter } from '../common/utils/ResolutionsFilter';
import { getStatusIP } from '../common/utils/getStatusIP';
import { ActivesType, UsersRole } from '../generated/prisma/enums';

@Injectable()
export class MainService {
    constructor(private prisma: PrismaService) {}

    createClientFilter(
        isArchived: boolean,
        derivedFilter: Prisma.ResolutionsWhereInput,
        archivedFilter: Prisma.ResolutionsWhereInput,
    ): Prisma.ResolutionsListRelationFilter {
        return {
            some: {
                isVisible: true,
                ...derivedFilter,
                ...(!isArchived ? archivedFilter : {}),
            },
            ...(isArchived ? { every: archivedFilter } : {}),
        };
    }

    getSqlAggregatedActives(
        clientIds: number[],
        {
            includeActives = true,
            includeDebit = true,
        }: { includeActives?: boolean; includeDebit?: boolean } = {},
    ): Promise<AmountsType[]> {
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
        return this.prisma.$queryRaw<AmountsType[]>(
            Prisma.sql`
                SELECT
                   actives.clientId,
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
                   SUM(realizationFirst.realizedPropertyAmount) +
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
                WHERE 
                    actives.clientId IN (${Prisma.join(clientIds)})
                  ${additionalCondition}
                  AND
                    actives.status <> 'GMU' 
                  AND
                    actives.isVisible = 1
                GROUP BY actives.clientId
            `,
        );
    }

    getInteractions(clientIds: number[]) {
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

    getRegions(data: GetMainParamsDto): Promise<RegionType[]> {
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data.isArchived, derivedFilter, archivedFilter),
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
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data.isArchived, derivedFilter, archivedFilter),
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
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data.isArchived, derivedFilter, archivedFilter),
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

        const resolutions = await this.prisma.resolutions.groupBy({
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
        });

        return resolutions.reduce((result: string[], item) => {
            const status: string = getStatusIP(item._count);
            return result.includes(status) ? result : [...result, status];
        }, []);
    }

    async getClients(
        data: GetMainParamsDto,
        role?: UsersRole,
        statistics: boolean = false,
        {
            includeActives = true,
            includeDebit = true,
        }: { includeActives?: boolean; includeDebit?: boolean } = {},
    ): Promise<any> {
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data.isArchived, derivedFilter, archivedFilter),
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

        const activeAmountsPromise = await this.getSqlAggregatedActives(clientIds, {
            includeActives,
            includeDebit,
        });

        const interactionsPromise = statistics
            ? this.getInteractions(clientIds)
            : Promise.resolve([]);

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
            );

            client['amounts'] = {
                resolutionAmount: resolution._sum.amount,
                resolutionBalance: resolution._sum.balance,
                ...amounts,
                clientId: undefined,
            };

            client['statusIP'] = getStatusIP(resolution._count);

            if (interaction) {
                const count = interaction._count;
                if (count.submissionDate + count.originalFilename_1 > 0)
                    client['interactionWithGMU'] =
                        role === UsersRole.LIMITED_ADMIN_GMU
                            ? 'Получено сообщение от МИУДОЛ'
                            : 'Получен ответ от ГМУ';
                else if (count.reviewDate + count.result + count.originalFilename_2 > 0)
                    client['interactionWithGMU'] = 'Отправлено';
            }
            client['interactionWithGMU'] = client['interactionWithGMU'] || '';

            // resolution._min.WritExecutionBeginDate
            // client[indicators] = ''
        }
        return clients;
    }
}
