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
import {DEADLINES} from "../common/constants";

@Injectable()
export class MainService {
    constructor(private prisma: PrismaService) {}

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

    private findAggregatedActives(
        aggregatedActives: ActiveDataType<AggregatedActivesType[]>,
        findActive: (actives: AggregatedActivesType[]) => AggregatedActivesType | undefined,
        isStatistics: boolean,
    ): ActiveDataType<AggregatedActivesType | undefined> {
        if (isStatistics) {
            const active = aggregatedActives as CommonStatisticActivesType<AggregatedActivesType[]>;
            return {
                COMMON: findActive(active.COMMON),
                ACTIVE: findActive(active.ACTIVE),
                DEBIT: findActive(active.DEBIT),
            };
        } else {
            const active = aggregatedActives as AggregatedActivesType[];
            return findActive(active)
        }
    }

    private getInteractions(clientIds: number[], isStatistics: boolean) {
        if (isStatistics)
            return Promise.resolve<
                {
                    clientId: number;
                    _count: any;
                }[]
            >([]);
        else
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
            isStatistics = false,
            selectedClientId = [],
        }: {
            isStatistics?: boolean;
            selectedClientId?: number[];
        } = {},
    ): Promise<ClientsType[]> {
        const regionFilter: Prisma.ClientsWhereInput = data.regionId && selectedClientId.length === 0
            ? { tno: { regionId: data.regionId } }
            : {};

        const clientByIdsFilter: Prisma.ClientsWhereInput = selectedClientId.length > 0
            ? { id: { in: selectedClientId } }
            : {};

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


        const clientIds: number[] = selectedClientId.length > 0
            ? selectedClientId
            : clients.map(({ id }): number => id);


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


        const aggregatedActivesPromise = this.getAggregatedActives(clientIds, isStatistics);


        const interactionsPromise = this.getInteractions(clientIds, isStatistics);


        const [resolutionsData, aggregatedActivesData, interactionsData] = await Promise.all([
            resolutionPromise,
            aggregatedActivesPromise,
            interactionsPromise,
        ]);


        for (const client of clients) {
            const resolution = resolutionsData.find(
                (item): boolean => item.clientId === client.id,
            );

            const aggregatedActive = this.findAggregatedActives(
                aggregatedActivesData,
                (actives: AggregatedActivesType[]) => actives.find(
                    (item: AggregatedActivesType): boolean => item.clientId === client.id,
                ),
                isStatistics,
            );

            const interaction = interactionsData.find(
                (item): boolean => item?.clientId === client.id,
            );


            client.amounts = {
                resolution: {
                    amount: resolution?._sum?.amount || null,
                    balance: resolution?._sum?.balance || null,
                },
                active: (aggregatedActive || {}) as ActiveDataType<AggregatedActivesType>,
            };








            if (!isStatistics) {
                const {
                    arrest,
                    countActives,
                    countArrestedActives,
                    countNoArrestedActives
                } = client.amounts.active as AggregatedActivesType;

                const arrestAmount = arrest || 0;
                const balanceAmount =  client.amounts.resolution.balance || 0;

                const isArrestAllActives = (countActives && countArrestedActives)
                    ? countActives === countArrestedActives
                    : false;
                const isExistsNoArrestedActive = countNoArrestedActives
                    ? countNoArrestedActives > 0
                    : false;

                if (arrestAmount >= balanceAmount)
                    client.securingArrest = 1;
                else if ((arrestAmount < balanceAmount) && isArrestAllActives)
                    client.securingArrest = 2;
                else if ((arrestAmount < balanceAmount) && isExistsNoArrestedActive)
                    client.securingArrest = 3;
                else
                    client.securingArrest = 4;
            }



            // client.statusIP = getStatusIP(resolution._count);








            if (interaction) {
                const count = interaction._count;
                const isExistsSubmit: boolean = count.submissionDate + count.originalFilename_1 > 0;
                const isExistsReview: boolean = count.reviewDate + count.result + count.originalFilename_2 > 0;
                client.interaction = {
                    GMU: isExistsSubmit
                            ? (isGMU ? 'Получено сообщение от МИУДОЛ' : 'Получен ответ от ГМУ')
                            : (isExistsReview ? 'Отправлено' : ''),
                };
            }

            if (!isStatistics) {
                const { lastUploadDate, countIsLeasing } = client.amounts.active as AggregatedActivesType;
                const currDate = new Date();
                const lastDate = new Date(lastUploadDate || 0);
                client.indicators = {
                    isUpdated: currDate.getTime() - lastDate.getTime() <= DEADLINES.WEEK,
                    isLeasing: (countIsLeasing || 0) > 0,
                };

                // resolution._min.WritExecutionBeginDate
            }
        }
        return clients;
    }
}
