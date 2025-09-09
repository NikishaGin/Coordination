import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInteractionDto, GetResolutionsParamsDto, UpdateInteractionDto } from './client.dto';
import { InteractionType } from '../generated/prisma/enums';
import { InteractionFilesInfo } from './types';
import { FileStorageService } from '../storage/storage.service';

// prettier-ignore
@Injectable()
export class ClientService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly storageService: FileStorageService,
    ) {}

    getResolutions(clientId: number, data: GetResolutionsParamsDto) {
        return this.prisma.resolutions.findMany({
            where: {
                clientId,
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

    protected extractFilenames(files: InteractionFilesInfo) {
        const { firstFile: [firstFileSource] = [], secondFile: [secondFileSource] = [] } = files;
        const { originalFilename: originalFilename_1, filename: systemsFilename_1 } = firstFileSource;
        const { originalFilename: originalFilename_2, filename: systemsFilename_2 } = secondFileSource;
        return {
            originalFilename_1, systemsFilename_1,
            originalFilename_2, systemsFilename_2,
        };
    }
}
