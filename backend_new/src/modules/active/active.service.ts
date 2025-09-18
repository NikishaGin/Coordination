import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActivesStatisticsResultType, ActivesStatisticsType } from "./active.type";
import { ActivesType, WantedResults } from '../../generated/prisma/enums';
import { OrderActives } from "../../common/constants";



@Injectable()
export class ActiveService {
    constructor(private prisma: PrismaService) {}

    async getActivesStatistics(clientId: number): Promise<ActivesStatisticsResultType> {
        const data = await this.prisma.actives.groupBy({
            by: ['type'],
            where: {
                clientId,
                isVisible: true,
                OR: [
                    {
                        wanted: {
                            OR: [
                                { endDate: null },
                                { result: { not: WantedResults.END_PROPERTY_SEARCH_ACTIVITIES } },
                            ],
                        }
                    },
                    { wanted: null },
                ]
            },
            _sum: { cost: true },
            _count: { id: true },
        });

        let stats: ActivesStatisticsType[] = [];
        let TOTAL = 0;
        data.forEach(({ type, _sum, _count }) => {
            const value = _sum?.cost ? Number(_sum?.cost) : 0;
            const count = _count?.id || 0;
            if (value > 0) {
                stats.push({ id: type, value, count });
                TOTAL += value;
            }
        });
        stats = stats.sort((a, b) => {
            return OrderActives[a.id] - OrderActives[b.id]
        });

        return { stats, TOTAL };
    }

    getActives(clientId: number, type: ActivesType): Promise<any[]> {
        return this.prisma.actives.findMany({
            where: {
                clientId,
                type,
            },
            include: {
                description: true,
                arrest: true,
                wanted: true,
                evaluation: true,
                realization: true,
                refundProperty: true,
                debitForeclosure: true,
                complaint: true,
            },
        });
    }

    createActive(clientId: number, type: ActivesType) {}

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
