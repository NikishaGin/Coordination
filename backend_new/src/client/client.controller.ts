import { Controller, Get } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get()
    getInfo() {}

    @Get('resolutions')
    getResolutions() {}

    @Get('actives-statistics')
    getActivesStatistics() {}

    @Get('actives')
    getActives() {}
}
