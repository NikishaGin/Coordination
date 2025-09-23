import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { StorageService } from "../storage/storage.service";
import { GetResolutionsParamsDto } from './client.dto';
import { InteractionType } from '../../generated/prisma/enums';
import {createServiceFilters} from "../../common/utils/ServiceFilters";

@Injectable()
export class ClientService {
    constructor(
        private prisma: PrismaService,
        private storage: StorageService,
    ) {}

    getResolutions(
        clientId: number,
        data: GetResolutionsParamsDto,
    ) {
        const { resolutionsFilter } = createServiceFilters(data.isDerived, data.isArchived);

        return this.prisma.resolutions.findMany({
            where: {
                clientId: clientId,
                ...resolutionsFilter,
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
            omit: {
                type: true,
                clientId: true,
                ...(
                    type === InteractionType.GMU ? { note: true, tnoId: true } : {}
                ),
            },
            ...(
                type === InteractionType.TNO
                    ? {
                        include: {
                            tno: { select: { CodeTNO: true } },
                        },
                    }
                    : {}
            ),
        });
    }

    /*
    createInteraction(clientId: number, metadata: CreateInteractionDto, files: InteractionFilesInfo) {
        return this.prisma.interactions.create({
            data: {
                clientId,
                ...metadata,
                ...this.extractFilenames(files),
            },
        });
    }

    async updateInteraction(
        interactionId: number,
        metadata: UpdateInteractionDto,
        files: InteractionFilesInfo,
    ) {
        const interaction = await this.prisma.interactions.findUnique({
            where: { id: interactionId },
        });
        if (!interaction) {
            throw new NotFoundException(`Interaction with id ${interactionId} not found.`);
        }

        const newFilenames = this.extractFilenames(files);
        const {
            systemsFilename_1: oldSystemsFilename_1,
            systemsFilename_2: oldSystemsFilename_2
        } = newFilenames;

        const { systemsFilename_1, systemsFilename_2 } = interaction;
        if (systemsFilename_1) {
            await this.storageService.deleteFile(oldSystemsFilename_1);
        }
        if (systemsFilename_2) {
            await this.storageService.deleteFile(oldSystemsFilename_2);
        }

        return this.prisma.interactions.update({
            where: { id: interactionId },
            data: { ...metadata, ...newFilenames },
        });
    }
     */
}
