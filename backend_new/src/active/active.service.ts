import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { ActivesType, InteractionType } from '../generated/prisma/enums';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

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
            omit: { clientId: true },
            include: {
                description: true,
                arrest: true,
                wanted: true,
                evaluation: true,
                encumbrance: true,
                realization: true,
                refundProperty: true,
                debitForeclosure: true,
                registration: true,
                complaint: true,
            },
        });
    }

    createActive(clientId: number, type: ActivesType) {

    }

    async updateActive(activeId: number, sourse: string) {
        const [entity, field] = sourse.split('.');
        const model = this.prisma[entity];
        await model.upsert({
            where: { activeId },
            update: {},
            create: {},
        });
    }
}
