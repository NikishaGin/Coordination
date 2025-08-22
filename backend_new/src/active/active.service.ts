import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Actives } from 'src/generated/prisma/client';
import {ActivesType, DataStatus, InteractionType, WantedResults} from '../generated/prisma/enums';

@Injectable()
export class ActiveService {
    constructor(private prisma: PrismaService) {}

    getActivesStatistics(clientId: number) {
        return this.prisma.actives.groupBy({
            by: ['type'],
            where: {
                clientId,
                isVisible: true,
                wanted: {
                    endDate: { not: null },
                    result: WantedResults.END_PROPERTY_SEARCH_ACTIVITIES,
                },
            },
            _sum: { cost: true },
            _count: { id: true },
        });
    }

    getActives(clientId: number, type: ActivesType): Promise<Actives> {
        return this.prisma.actives.findMany({
            where: {
                clientId,
                type,
                status: { not: DataStatus.GMU }, // !!!!!!!!!!
            },
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
        // realizations
        const values = await this.prisma[entity].upsert({
            where: { activeId },
            update: {
                [field]: 1,
            },
            create: {
                activeId,
                [field]: 1,
            },
        });
        const data = Object.entries(values).filter(([f, _]) => !['id', 'activeId'].includes(f));
        const isEmptyRecord = data.every(([_, v]) => !v);
        if (isEmptyRecord) {
            await this.prisma[entity].delete({ where: { id: values.id } });
        }
    }
}
