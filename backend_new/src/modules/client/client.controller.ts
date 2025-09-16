import {Body, Controller, Get, Param, Patch, Post, Query} from '@nestjs/common';
import { ClientService } from './client.service';
import { GetResolutionsParamsDto } from './client.dto';
// import { ActivesType, InteractionType } from '../../generated/prisma/enums';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get('resolutions/:clientId')
    getResolutions(
        @Param('clientId') clientId: number,
        @Query() query: GetResolutionsParamsDto
    ) {
        return this.clientService.getResolutions(clientId, query.isDerived, query.isArchived);
    }

    /*
    @Get('interactions/:clientId')
    getInteractions(
        @Param('clientId') clientId: number,
        @Query('type') type: InteractionType
    ) {
        return this.clientService.getInteractions(clientId, type);
    }

    @Post('interactions/:clientId')
    // @UseInterceptors(ClientController.FilesInterceptor)
    createInteraction(
        @Body() data: CreateInteractionDto,
        // @UploadedFiles() files: InteractionFilesInfo,
    ) {
        return this.clientService.createInteraction(clientId, data, files);
    }

    @Patch('interactions/:interactionId')
    // @UseInterceptors(ClientController.FilesInterceptor)
    updateInteraction(
        @Param('interactionId') interactionId: number,
        @Body() data: UpdateInteractionDto,
        // @UploadedFiles() files: InteractionFilesInfo,
    ) {
        return this.clientService.updateInteraction(interactionId, data, files);
    }
     */
}
