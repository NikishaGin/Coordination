import { Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { ActiveService } from './active.service';
import { ActivesType } from '../../generated/prisma/enums';

@Controller('actives')
export class ActiveController {
    constructor(private readonly activeService: ActiveService) {}

    @Get(':clientId/statistics')
    getActivesStatistics(@Param('clientId') clientId: number) {
        return this.activeService.getActivesStatistics(clientId);
    }

    @Get(':clientId/:typeActive')
    getActives(@Param('clientId') clientId: number, @Param('typeActive') typeActive: ActivesType) {
        return this.activeService.getActives(clientId, typeActive);
    }

    @Post(':clientId')
    createActive() {}

    @Patch(':clientId')
    updateActive() {}
}
