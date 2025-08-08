import { Injectable } from '@nestjs/common';
import { Prisma, ClientCategories } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MainDto } from './main.dto';

@Injectable()
export class MainService {
    constructor(private prisma: PrismaService) {}

    createClientFilter(data: MainDto): Prisma.ResolutionsListRelationFilter {
        const isExistsDate = data.isArchived ? { equals: null } : { not: null };
        const filterIsArchived = {
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

    getClientCategories(
        clientFilter: Prisma.ResolutionsListRelationFilter,
    ): Promise<ClientCategories[]> {
        return this.prisma.clientCategories.findMany({
            where: {
                client: {
                    some: { resolution: clientFilter },
                    every: { isVisible: true },
                },
            },
        });
    }

    /*
    getStatusesIP(): Promise<any> {
        return;
    }
     */

    getRegions(
        clientFilter: Prisma.ResolutionsListRelationFilter,
    ): Promise<any> {
        return this.prisma.regions.findMany({
            omit: { sonoName: true },
            where: {
                tno: {
                    some: {
                        client: {
                            some: { resolution: clientFilter },
                            every: { isVisible: true },
                        },
                    },
                },
            },
        });
    }

    async getClients(
        regionId: number,
        clientFilter: Prisma.ResolutionsListRelationFilter,
    ): Promise<any> {
        const clients = await this.prisma.clients.findMany({
            where: {
                resolution: clientFilter,
                isVisible: true,
                tno: { regionId },
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
        });

        const clientIds: number[] = clients.map(({ id }) => id);

        const resolutionSums = await this.prisma.resolutions.groupBy({
            by: ['clientId'],
            where: {
                isVisible: true,
                clientId: { in: clientIds },
            },
            _sum: {
                amount: true,
                balance: true,
            },
            _min: {
                WritExecutionBeginDate: true,
            },
        });

        console.log(`
            SELECT actives.clientId, SUM(t.cost) as totalCost
            FROM actives
            WHERE ((isVisible = 1) AND (actives.clientId IN ${clientIds}))
            LEFT JOIN description_actives t ON actives.id = t.id
            GROUP BY actives.clientId
        `);

        const activeSums = await this.prisma.$queryRaw`
            SELECT actives.clientId, SUM(t.cost) as totalCost
            FROM actives
            WHERE ((isVisible = 1) AND (actives.clientId IN ${clientIds}))
            LEFT JOIN description_actives t ON actives.id = t.id
            GROUP BY actives.clientId
        `;

        const arrestSums = await this.prisma.$queryRaw`
            SELECT actives.clientId, SUM(t.amount) as totalAmount
            FROM actives
            WHERE ((isVisible = 1) AND (actives.clientId IN ${clientIds}))
            LEFT JOIN arrests t ON actives.id = t.id
            GROUP BY actives.clientId
        `;

        /*
        const wontendSums = await this.prisma.$queryRaw`
            SELECT actives.clientId,
            FROM actives
            WHERE ((isVisible = 1) AND (actives.clientId IN ${clientIds}))
            LEFT JOIN wonteds t ON actives.id = t.id
            GROUP BY actives.clientId
        `;
         */

        const evaluationSums = await this.prisma.$queryRaw`
            SELECT actives.clientId, SUM(t.amount) as totalAmount
            FROM actives
            WHERE ((isVisible = 1) AND (actives.clientId IN ${clientIds}))
            LEFT JOIN evaluation t ON actives.id = t.id
            GROUP BY actives.clientId
        `;

        for (const client of clients) {
            console.log(client);
        }

        return clients;
    }
}
