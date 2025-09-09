import { Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ActiveService } from './active.service';
import { ActivesType } from '../generated/prisma/enums';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { UserPayload } from '../common/interfaces/user-payload.interface';

// prettier-ignore
@UseGuards(JwtAuthGuard)
@Controller('clients/:clientId/actives')
export class ActiveController {
    constructor(private readonly activeService: ActiveService) {}

    @Get('statistics')
    getActivesStatistics(@Param('clientId') clientId: number) {
        return this.activeService.getActivesStatistics(clientId);
    }

    // ToDo: Защитить от добавления interaction для типа не по роли пользователя
    @Get(':typeActive')
    getActives(
        @Param('clientId') clientId: number,
        @Param('typeActive') typeActive: ActivesType,
        // @RequestUser() user: UserPayload,
    ) {
        return this.activeService.getActives(clientId, typeActive);
    }

    @Post('')
    createActive() {}

    @Patch(':activeId')
    updateActive() {}
}
