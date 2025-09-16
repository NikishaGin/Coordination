import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { GetMainParamsDto } from './main.dto';
import {createDataFilters} from '../../common/utils/ResolutionsFilter';
import {AggregatedStatisticsService} from "../aggregated-statistics/aggregated-statistics.service";
import {STATUS_IP} from "../../common/constants";


@Injectable()
export class MainService {
    constructor(
        private prisma: PrismaService,
        private stats: AggregatedStatisticsService,
    ) {}

    getRegions(
        data: GetMainParamsDto,
        userRegionId: number | null
    ): Promise<Prisma.RegionsGetPayload<{ omit: { sonoName: true } }>[]> {
        const regionFilter: Prisma.RegionsWhereInput =
            userRegionId !== null ? { id: userRegionId } : {};
        const { clientsFilter } = createDataFilters(data.isDerived, data.isArchived);

        return this.prisma.regions.findMany({
            omit: { sonoName: true },
            where: {
                ...regionFilter,
                tno: {
                    some: {
                        client: { some: clientsFilter },
                    },
                },
            },
            orderBy: [{ regionCode: 'asc' }],
        });
    }

    getClientCategories(data: GetMainParamsDto): Promise<Prisma.ClientCategoriesGetPayload<{}>[]> {
        /*
        const { clientsFilter } = createDataFilters(data.isDerived, data.isArchived);
        if (data?.regionId)
            clientsFilter.tno = { regionId: data.regionId };

        {
            where: {
                client: { some: clientsFilter },
            },
        }
        */
        return this.prisma.clientCategories.findMany({
            orderBy: [{ category: 'asc' }],
        });
    }

    getStatusesIP(data: GetMainParamsDto): string[] {
        /*
        const { clientsFilter, resolutionsFilter } = createDataFilters(data.isDerived, data.isArchived);
        if (data?.regionId)
            clientsFilter.tno = { regionId: data.regionId };

        const clients: { id: number }[] = await this.prisma.clients.findMany({
            where: clientsFilter,
            select: { id: true },
        });

        const clientIds: number[] = clients.map(({ id }: { id: number }): number => id);

        const resolutions = await this.prisma.resolutions.groupBy({
            by: ['clientId'],
            where: {
                clientId: { in: clientIds },
                ...resolutionsFilter,
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
        return Object.values(STATUS_IP).sort();
    }

    getClients(
        data: GetMainParamsDto,
        isGMU: boolean,
    ) {
        const { clientsFilter, resolutionsFilter } = createDataFilters(data.isDerived, data.isArchived);
        if (data?.regionId)
            clientsFilter.tno = { regionId: data.regionId };

        return this.stats.getMainData(clientsFilter, resolutionsFilter, isGMU);
    }
}
