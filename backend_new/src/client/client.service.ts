import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetResolutionsParamsDto } from './client.dto';
import { InteractionType } from '../generated/prisma/enums';

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

    getInteractions(clientId: number, type: InteractionType) {
        return this.prisma.interactions.findMany({
            where: { clientId, type },
        });
    }
}
