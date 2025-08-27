import { Injectable } from '@nestjs/common';
import { ClientCategories, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    GetMainParamsDto,
    AggregatedActivesType,
    RegionsType,
    ClientsType,
    ActiveAmountsType,
} from './main.dto';
import { getArchivedFilter, getDerivedFilter } from '../common/utils/ResolutionsFilter';
import { getStatusIP, StatusMap } from '../common/utils/getStatusIP';
import { ActivesType } from '../generated/prisma/enums';

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
    ): Promise<AggregatedActivesType[]> {
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

    getRegions(data: GetMainParamsDto, userRegionId: number | null): Promise<RegionsType[]> {
        const regionFilter: Prisma.RegionsWhereInput =
            userRegionId !== null ? { id: userRegionId } : {};

        const clientFilter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(
                data.isArchived,
                getDerivedFilter(data.isDerived),
                getArchivedFilter(data.isArchived),
            ),
        };

        return this.prisma.regions.findMany({
            omit: { sonoName: true },
            where: {
                ...regionFilter,
                tno: {
                    some: {
                        client: {
                            some: clientFilter,
                            every: { isVisible: true },
                        },
                    },
                },
            },
        });
    }

    getClientCategories(data: GetMainParamsDto): Promise<ClientCategories[]> {
        /*
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);

        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data.isArchived, derivedFilter, archivedFilter),
            ...(data?.regionId ? { tno: { regionId: data.regionId } } : {}),
        };
         */
        /*
        {
            where: {
                client: {
                    some: filter,
                    every: { isVisible: true },
                },
            },
        }
        */
        return this.prisma.clientCategories.findMany();
    }

    getStatusesIP(data: GetMainParamsDto): string[] {
        /*
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const filter: Prisma.ClientsWhereInput = {
            resolution: this.createClientFilter(data.isArchived, derivedFilter, archivedFilter),
            ...(data?.regionId ? { tno: { regionId: data.regionId } } : {}),
        };
        const clients: { id: number }[] = await this.prisma.clients.findMany({
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
         */
        return Object.values(StatusMap);
    }

    async getClients(
        data: GetMainParamsDto,
        isGMU?: boolean,
        {
            statistics = false,
            selectedClientId = [],
        }: {
            statistics?: boolean;
            selectedClientId?: number[];
        } = {},
    ): Promise<ClientsType[]> {
        const regionFilter: Prisma.ClientsWhereInput =
            data.regionId && selectedClientId.length === 0
                ? { tno: { regionId: data.regionId } }
                : {};

        const clientByIdsFilter: Prisma.ClientsWhereInput =
            selectedClientId.length > 0 ? { id: { in: selectedClientId } } : {};

        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const clientFilter: Prisma.ClientsWhereInput = {
            ...clientByIdsFilter,
            ...regionFilter,
            resolution: this.createClientFilter(data.isArchived, derivedFilter, archivedFilter),
        };

        const clients = (await this.prisma.clients.findMany({
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
        })) as ClientsType[];

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

        const activeAmountsPromise = statistics
            ? Promise.all([
                  this.getSqlAggregatedActives(clientIds, {
                      includeActives: true,
                      includeDebit: true,
                  }),
                  this.getSqlAggregatedActives(clientIds, {
                      includeActives: true,
                      includeDebit: false,
                  }),
                  this.getSqlAggregatedActives(clientIds, {
                      includeActives: false,
                      includeDebit: true,
                  }),
              ]).then(([common, active, debit]) => ({
                  COMMON: common,
                  ACTIVE: active,
                  DEBIT: debit,
              }))
            : this.getSqlAggregatedActives(clientIds);

        const interactionsPromise = statistics
            ? Promise.resolve<
                  {
                      clientId: number;
                      _count: any;
                  }[]
              >([])
            : this.prisma.interactions.groupBy({
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

            const amounts: ActiveAmountsType = !statistics
                ? (activeAmounts as AggregatedActivesType[]).find(
                      (item: AggregatedActivesType): boolean => item.clientId === client.id,
                  )!
                : {
                      COMMON: (activeAmounts as { COMMON: AggregatedActivesType[] }).COMMON.find(
                          (item: AggregatedActivesType): boolean => item.clientId === client.id,
                      )!,
                      ACTIVE: (activeAmounts as { ACTIVE: AggregatedActivesType[] }).ACTIVE.find(
                          (item: AggregatedActivesType): boolean => item.clientId === client.id,
                      )!,
                      DEBIT: (activeAmounts as { DEBIT: AggregatedActivesType[] }).DEBIT.find(
                          (item: AggregatedActivesType): boolean => item.clientId === client.id,
                      )!,
                  };

            const interaction = interactionsData.find(
                (item): boolean => item?.clientId === client.id,
            );

            client.amounts = {
                resolution: {
                    amount: resolution._sum.amount,
                    balance: resolution._sum.balance,
                },
                actives: amounts,
            };

            client.statusIP = getStatusIP(resolution._count);

            if (interaction) {
                const count = interaction._count!;
                if (count.submissionDate + count.originalFilename_1 > 0)
                    client['interactionWithGMU'] = isGMU
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
