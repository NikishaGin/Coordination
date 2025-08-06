import { Injectable } from '@nestjs/common';
import { Prisma, DebtorCategories } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MainDto } from './main.dto';

@Injectable()
export class MainService {
    constructor(private prisma: PrismaService) {}

    createClientFilter(data: MainDto): Prisma.ResolutionsListRelationFilter {
        return {
            some: {
                isDerived: data.isDerived,
                ...(!data.isArchived ? { isArchived: false } : {}), /////////////////////////
            },
            every: {
                isVisible: true,
                ...(data.isArchived ? { isDerived: true } : {}),
            },
        };
    }

    getDebtorCategories(): Promise<DebtorCategories[]> {
        return this.prisma.debtorCategories.findMany();
    }

    getRegions(
        clientFilter: Prisma.ResolutionsListRelationFilter,
    ): Promise<any> {
        return this.prisma.regions.findMany({
            omit: { sonoName: true },
            where: {
                tno: {
                    some: {
                        person: {
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
        return this.prisma.debtorPersons.findMany({
            where: {
                resolution: clientFilter,
                tno: { regionId },
            },
            include: {
                tno: true,
                sosp: true,
                category: true,
                resolution: true,
            },
        });
    }
}
