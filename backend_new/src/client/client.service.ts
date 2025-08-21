import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetResolutionsParamsDto } from './client.dto';
import { Prisma } from 'src/generated/prisma/client';
import { ActivesType } from '../common/enums/active.enum';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

    getResolutions(data: GetResolutionsParamsDto) {
        return this.prisma.resolutions.findMany({
            where: {
                clientId: data.clientId,
                isDerived: data.isDerived,
                isArchived: data.isArchived,
                isVisible: true,
            },
            select: {
                number: true,
                date: true,
                amount: true,
                balance: true,
                WritExecutionNumber: true,
                WritExecutionBeginDate: true,
            },
        });
    }

    getActivesStatistics(clientId: number) {
        return this.prisma.$queryRaw(Prisma.sql`
        SELECT
            SUM(description.cost) AS cost,
            COUNT(description.id) AS count
        FROM actives
        LEFT JOIN description_actives AS description ON actives.id = description.id
        WHERE 
            actives.clientId = ${clientId} 
          AND
            actives.isVisible = 1
          AND
            wanteds.endDate IS NOT NULL
          AND 
            wanteds.result = 'END_PROPERTY_SEARCH_ACTIVITIES'
        GROUP BY actives.type
        `);
    }

    getActives(clientId: number, type: ActivesType) {
        return this.prisma.actives.findMany({
            where: { clientId, type },
            include: {},
        });
    }

    getInteractions(clientId: number) {}
}
