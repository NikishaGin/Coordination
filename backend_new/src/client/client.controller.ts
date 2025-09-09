import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateInteractionDto, GetResolutionsParamsDto, UpdateInteractionDto } from './client.dto';
import { InteractionType } from '../generated/prisma/enums';
import { InteractionFilesConfig, InteractionFilesInfo } from './types';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { FileFieldsInterceptor } from '@blazity/nest-file-fastify';

// prettier-ignore
@UseGuards(JwtAuthGuard)
@Controller('clients/:clientId')
export class ClientController {
    private static readonly FilesInterceptor = FileFieldsInterceptor([
        { name: 'firstFile', maxCount: 1 },
        { name: 'secondFile', maxCount: 1 },
    ] satisfies InteractionFilesConfig);

    constructor(private readonly clientService: ClientService) {}
    @Get('resolutions/')
    getResolutions(
        @Param('clientId') clientId: number,
        @Query() query: GetResolutionsParamsDto,
    ) {
        return this.clientService.getResolutions(clientId, query);
    }

    @Get('interactions/')
    getInteractions(
        @Param('clientId') clientId: number,
        @Query('type') type: InteractionType,
    ) {
        return this.clientService.getInteractions(clientId, type);
    }

    @Post('/interactions/')
    @UseInterceptors(ClientController.FilesInterceptor)
    createInteraction(
        @Param('clientId') clientId: number,
        @Body() data: CreateInteractionDto,
        @UploadedFiles() files: InteractionFilesInfo,
    ) {
        return this.clientService.createInteraction(clientId, data, files);
    }

    @Patch('/interactions/:interactionId')
    @UseInterceptors(ClientController.FilesInterceptor)
    updateInteraction(
        @Param('interactionId') interactionId: number,
        @Body() data: UpdateInteractionDto,
        @UploadedFiles() files: InteractionFilesInfo,
    ) {
        return this.clientService.updateInteraction(interactionId, data, files);
    }
}
