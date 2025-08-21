import { Controller, Get, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { GetResolutionsParamsDto } from './client.dto';
import { ActivesType, InteractionType } from '../generated/prisma/enums';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get('resolutions')
    getResolutions(@Query() query: GetResolutionsParamsDto) {
        return this.clientService.getResolutions(query);
    }

    @Get('actives-statistics')
    getActivesStatistics(@Query('clientId') clientId: number) {
        return this.clientService.getActivesStatistics(clientId);
    }

    @Get('actives')
    getActives(@Query('clientId') clientId: number, @Query('type') type: ActivesType) {
        return this.clientService.getActives(clientId, type);
    }

    @Get('interactions')
    getInteractions(@Query('clientId') clientId: number, @Query('type') type: InteractionType) {
        return this.clientService.getInteractions(clientId, type);
    }
}
