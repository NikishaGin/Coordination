import { Controller, Get, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { GetResolutionsParamsDto } from './client.dto';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get('resolutions')
    getResolutions(@Query() query: GetResolutionsParamsDto) {
        return this.clientService.getResolutions(query);
    }

    @Get('actives-statistics')
    getActivesStatistics(@Query('clientId') clientId: number) {}

    @Get('actives')
    getActives(@Query('clientId') clientId: number) {}

    @Get('interactions')
    getInteractions(@Query('clientId') clientId: number) {}
}
