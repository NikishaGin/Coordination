import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { ClientService } from './client.service';
import { GetResolutionsParamsDto } from './client.dto';
import {JwtAuthGuard} from "../../common/guards/auth.guard";
// import { ActivesType, InteractionType } from '../../generated/prisma/enums';


@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get('/:clientId/resolutions')
    getResolutions(
        @Param('clientId') clientId: number,
        @Query() query: GetResolutionsParamsDto
    ) {
        return this.clientService.getResolutions(clientId, query);
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
