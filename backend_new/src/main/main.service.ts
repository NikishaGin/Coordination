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
            cost: null | number;
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
                actives.clientId in (${Prisma.join(clientIds)})
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
            client['resolution'] = resolution.find(
                (item) => item.clientId === client.id,
            );
        }

        return clients;
    }
}
