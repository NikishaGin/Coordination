import { Injectable } from '@nestjs/common';
import { Prisma, ClientCategories } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MainDto } from './main.dto';
import { getActiveSums } from '../generated/prisma/sql/getActiveSums';

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

    getRegions(data: MainDto): Promise<any> {
        const clientFilter: Prisma.ResolutionsListRelationFilter =
            this.createClientFilter(data);
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

    getClientCategories(data: MainDto): Promise<ClientCategories[]> {
        const clientFilter: Prisma.ResolutionsListRelationFilter =
            this.createClientFilter(data);
        return this.prisma.clientCategories.findMany({
            where: {
                client: {
                    some: {
                        resolution: clientFilter,
                        ...(data?.regionId
                            ? { tno: { regionId: data.regionId } }
                            : {}),
                    },
                    every: { isVisible: true },
                },
            },
        });
    }

    getStatusesIP(): Promise<any> {
        return;
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
                resolution: {
                    where: {
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
                    orderBy: {
                        WritExecutionStopDate: 'asc',
                        WritExecutionEndReason: 'asc',
                        WritExecutionPostponementDate: 'asc',
                        WritExecutionTerminateDate: 'asc',
                    },
                },
            },
        });

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

        const clientIdsArray: string = clientIds.join();
        const activeSums = await this.prisma.$queryRawTyped(
            getActiveSums(clientIdsArray),
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
