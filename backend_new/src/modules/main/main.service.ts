import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { GetMainParamsDto } from './main.dto';
import { getArchivedFilter, getDerivedFilter } from '../../common/utils/ResolutionsFilter';
import {AggregatedStatisticsService} from "../aggregated-statistics/aggregated-statistics.service";
import {STATUS_IP} from "../../common/constants";


@Injectable()
export class MainService {
    constructor(
        private prisma: PrismaService,
        private stats: AggregatedStatisticsService,
    ) {}

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

    getRegions(
        data: GetMainParamsDto,
        userRegionId: number | null
    ): Promise<Prisma.RegionsGetPayload<{ omit: { sonoName: true } }>[]> {
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

    getClientCategories(data: GetMainParamsDto): Promise<Prisma.ClientCategoriesGetPayload<{}>[]> {
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
        return Object.values(STATUS_IP);
    }

    getClients(
        data: GetMainParamsDto,
        isGMU: boolean,
    ) {
        const regionFilter: Prisma.ClientsWhereInput = data.regionId ? {tno: {regionId: data.regionId}} : {};
        const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(data.isDerived);
        const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(data.isArchived);
        const clientFilter: Prisma.ClientsWhereInput = {
            ...regionFilter,
            resolution: this.createClientFilter(data.isArchived, derivedFilter, archivedFilter),
        };
        const resolutionsFilter: Prisma.ResolutionsWhereInput = {
            ...derivedFilter,
            ...archivedFilter
        }

        return this.stats.getMainData(clientFilter, resolutionsFilter, isGMU);
    }
}
