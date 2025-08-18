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
        const isExistsDate = data.isArchived ? { equals: null } : { not: null };
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

    getClientCategories(data: GetMainParamsDto): Promise<ClientCategories[]> {
        const clientFilter: Prisma.ResolutionsListRelationFilter =
            this.createClientFilter(data);
        const regionFilter: Prisma.ClientsWhereInput = data?.regionId
            ? { tno: { regionId: data.regionId } }
            : {};
        return this.prisma.clientCategories.findMany({
            where: {
                client: {
                    some: {
                        resolution: clientFilter,
                        ...regionFilter,
                    },
                    every: { isVisible: true },
                },
            },
        });
    }

    getStatusesIP(data: GetMainParamsDto): Promise<string[]> {
        const clientFilter: Prisma.ResolutionsListRelationFilter =
            this.createClientFilter(data);
        const regionFilter: Prisma.ClientsWhereInput = data?.regionId
            ? { tno: { regionId: data.regionId } }
            : {};
        return;
    }

    async getClients(data: GetMainParamsDto): Promise<any> {
        const clientFilter: Prisma.ResolutionsListRelationFilter =
            this.createClientFilter(data);
        const regionFilter: Prisma.ClientsWhereInput = data?.regionId
            ? { tno: { regionId: data.regionId } }
            : {};
        const clients = await this.prisma.clients.findMany({
            where: {
                isVisible: true,
                resolution: clientFilter,
                ...regionFilter,
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
                        WritExecutionStopDate: 'desc',
                        WritExecutionEndReason: 'desc',
                        WritExecutionPostponementDate: 'desc',
                        WritExecutionTerminateDate: 'desc',
                    },
                },
            },
        });
        const clientIds: number[] = clients.map(({ id }) => id);
        const clientIdsArray: string = clientIds.join();

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
