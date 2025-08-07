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

    getClientCategories(): Promise<ClientCategories[]> {
        return this.prisma.clientCategories.findMany();
    }

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

    getClients(
        regionId: number,
        clientFilter: Prisma.ResolutionsListRelationFilter,
    ): Promise<any> {
        /*
        return this.prisma.clients.findMany({
            where: {
                resolution: clientFilter,
                isVisible: true,
                tno: { regionId },
            },
            include: {
                tno: true,
                sosp: true,
                category: true,
            },
            select: {
                _sum: {
                    select: {
                        resolutionAmount: {
                            sum: true,
                            field: 'amount',
                        },
                        resolutionBalance: {
                            sum: true,
                            field: 'balance',
                        },
                    },
                },
            },
        });
        */
        return this.prisma.realizations.groupBy({
            by: ['clientId'],
            _sum: {
                amount: true,
                ba,
            },
        });
    }
}
