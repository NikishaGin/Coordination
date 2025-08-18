import { Injectable } from '@nestjs/common';
import { Prisma, ClientCategories } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMainParamsDto, RegionType } from './main.dto';
import { getActiveSums } from '../generated/prisma/sql/getActiveSums';

@Injectable()
export class MainService {
    constructor(private prisma: PrismaService) {}

    createClientFilter(
        data: GetMainParamsDto,
    ): Prisma.ResolutionsListRelationFilter {
        const isExistsDate = data.isArchived ? { not: null } : { equals: null };
        const filterIsArchived: Prisma.ResolutionsWhereInput = {
            OR: [
                { isArchived: data.isArchived },
                { WritExecutionEndDate: isExistsDate },
                { WritExecutionTerminateDate: isExistsDate },
            ],
        };
        return {
            some: {
                isDerived: data.isDerived,
                ...(!data.isArchived ? filterIsArchived : {}),
            },
            every: {
                isVisible: true,
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

    /*
    getStatusesIP(data: GetMainParamsDto): Promise<string[]> {
        const clientFilter: Prisma.ResolutionsListRelationFilter =
            this.createClientFilter(data);
        const regionFilter: Prisma.ClientsWhereInput = data?.regionId
            ? { tno: { regionId: data.regionId } }
            : {};
        return;
    }
     */

    async getClients(data: GetMainParamsDto): Promise<any> {
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
                resolution: {
                    where: {
                        isVisible: true,
                        isDerived: data.isDerived,
                        isArchived: data.isArchived,
                        OR: [
                            { WritExecutionStopDate: { not: null } },
                            { WritExecutionEndReason: { not: null } },
                            { WritExecutionPostponementDate: { not: null } },
                            { WritExecutionTerminateDate: { not: null } },
                        ],
                    },
                    select: {
                        WritExecutionStopDate: true,
                        WritExecutionEndReason: true,
                        WritExecutionPostponementDate: true,
                        WritExecutionTerminateDate: true,
                    },
                    take: 1,
                    orderBy: [
                        { WritExecutionStopDate: 'desc' },
                        { WritExecutionEndReason: 'desc' },
                        { WritExecutionPostponementDate: 'desc' },
                        { WritExecutionTerminateDate: 'desc' },
                    ],
                },
            },
        });

        const clientIds: number[] = clients.map(({ id }) => id);

        const resolution = await this.prisma.resolutions.groupBy({
            by: ['clientId'],
            where: {
                clientId: { in: clientIds },
                isVisible: true,
            },
            _sum: {
                amount: true,
                balance: true,
            },
            _min: {
                WritExecutionBeginDate: true,
            },
        });

        type SumsType = {
            clientId: number;
        };

        const activeSums: SumsType[] = await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT
                actives.clientId,
                SUM(description.cost) AS totalSum,
                SUM(arrests.amount) AS arrest,
                SUM(evaluations.amount) AS evaluation,
                SUM(refund_property.amount) AS refundProperty
            FROM actives
            LEFT JOIN description_actives AS description ON actives.id = description.id
            LEFT JOIN arrests ON actives.id = arrests.activeId
            LEFT JOIN evaluations ON actives.id = evaluations.activeId
            LEFT JOIN refund_property ON actives.id = refund_property.activeId
            WHERE
                actives.clientId IN (${Prisma.join(clientIds)})
              AND
                actives.isVisible = 1
            GROUP BY actives.clientId
        `,
        );

        for (const client of clients) {
            client['CodeTNO'] = client.tno?.CodeTNO;
            // delete client.tno;
            client['CodeSOSP'] = client.sosp?.CodeSOSP;
            // delete client.sosp;
            client['amounts'] = activeSums.find(
                (item) => item.clientId === client.id,
            );
            // client['statusIP'] = client['resolution']
            client['resolution'] = {
                ...client['resolution'],
            };
        }
        return clients;
    }
}
