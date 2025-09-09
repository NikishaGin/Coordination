import { Injectable } from '@nestjs/common';
import { ClientCategories, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMainParamsDto } from './main.dto';
import { getArchivedFilter, getDerivedFilter } from '../common/utils/ResolutionsFilter';
import { getStatusIP, StatusMap } from '../common/utils/getStatusIP';
import {ActivesType, LeasStatus} from '../generated/prisma/enums';
import {
    RegionsType,
    AggregatedActivesType,
    ClientsType,
    ActiveDataType, CommonStatisticActivesType,
} from "./main.type";
import {sqlAggregatedActivesData} from "./main.SQLqueries";

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

    getAggregatedActives(
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
            sqlAggregatedActivesData(clientIds, additionalCondition),
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


        const aggregatedActivesPromise: Promise<ActiveDataType<AggregatedActivesType[]>> = statistics
            ? Promise.all([
                  this.getAggregatedActives(clientIds, {
                      includeActives: true,
                      includeDebit: true,
                  }),
                  this.getAggregatedActives(clientIds, {
                      includeActives: true,
                      includeDebit: false,
                  }),
                  this.getAggregatedActives(clientIds, {
                      includeActives: false,
                      includeDebit: true,
                  }),
              ]).then(([common, active, debit]) => ({
                  COMMON: common,
                  ACTIVE: active,
                  DEBIT: debit,
              }))
            : this.getAggregatedActives(clientIds);


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


        const [resolutionsData, aggregatedActives, interactionsData] = await Promise.all([
            resolutionPromise,
            aggregatedActivesPromise,
            interactionsPromise,
        ]);

        for (const client of clients) {
            const resolution = resolutionsData.find(
                (item): boolean => item.clientId === client.id,
            )!;

            let activeData: ActiveDataType<AggregatedActivesType>;
            if (!statistics) {
                const active = aggregatedActives as AggregatedActivesType[];
                activeData = active.find(
                    (item: AggregatedActivesType): boolean => item.clientId === client.id,
                )!;
            } else {
                const active = aggregatedActives as CommonStatisticActivesType<AggregatedActivesType[]>;
                const entriesActive = Object.entries(active).map(
                    ([nameStatistics, data]) => {
                        const foundData = data.find(item => item.clientId === client.id)!;
                        return [nameStatistics, foundData];
                    }
                );
                activeData = Object.fromEntries(entriesActive);
            }



            const interaction = interactionsData.find(
                (item): boolean => item?.clientId === client.id,
            );

            client.amounts = {
                resolution: {
                    amount: resolution._sum.amount,
                    balance: resolution._sum.balance,
                },
                actives: activeData,
            };


            if (!statistics) {
                const { arrest = 0, isArrestAllActives, isExistsNoArrestedActive } = client.amounts.actives as AggregatedActivesType;
                const arrestAmount = arrest || 0;
                const balanceAmount =  client.amounts.resolution.balance || 0;
                if (arrestAmount >= balanceAmount)
                    client.securingArrest = 1;
                else if ((arrestAmount < balanceAmount) && isArrestAllActives)
                    client.securingArrest = 2;
                else if ((arrestAmount < balanceAmount) && isExistsNoArrestedActive)
                    client.securingArrest = 3;
                else
                    client.securingArrest = 4;
            }

            client.statusIP = getStatusIP(resolution._count);

            if (interaction) {
                const count = interaction._count!;
                const isExistsSubmit: boolean = count.submissionDate + count.originalFilename_1 > 0;
                const isExistsReview: boolean = count.reviewDate + count.result + count.originalFilename_2 > 0;
                client.interaction = {
                    GMU: isExistsSubmit
                            ? (isGMU ? 'Получено сообщение от МИУДОЛ' : 'Получен ответ от ГМУ')
                            : (isExistsReview ? 'Отправлено' : ''),
                };
            }

            if (!statistics) {
                const { lastUploadDate, isLeasing } = client.amounts.actives as AggregatedActivesType;
                const currDate = new Date();
                const lastDate = new Date(lastUploadDate ?? 0);
                client.indicators = {
                    isUpdated: currDate.getTime() - lastDate.getTime() <= 7 * 24 * 60 * 60 * 1000,
                    isLeasing: !!isLeasing,
                };

                // resolution._min.WritExecutionBeginDate
            }
        }
        return clients;
    }
}
