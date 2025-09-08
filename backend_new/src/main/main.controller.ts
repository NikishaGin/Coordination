import {Controller, Get, Query, Request, UseGuards} from '@nestjs/common';
import { MainService } from './main.service';
import { GetMainParamsDto } from './main.dto';
import { AuthenticatedRequest } from '../common/interfaces/user-request.interface';
import { UsersRole } from '../generated/prisma/enums';
import {JwtAuthGuard} from "../common/guards/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('main')
export class MainController {
    constructor(private readonly mainService: MainService) {}

    @Get('regions')
    getRegions(@Query() query: GetMainParamsDto, @Request() request: AuthenticatedRequest) {
        const role: UsersRole = request.user.role;
        const isUser: boolean = role === UsersRole.USER;
        const userRegionId: number | null = isUser ? request.user.regionId : null;
        return this.mainService.getRegions(query, userRegionId);
    }

    @Get('categories')
    getClientCategories(
        @Query() query: GetMainParamsDto,
        @Request() request: AuthenticatedRequest,
    ) {
        const role: UsersRole = request.user.role;
        const isUser: boolean = role === UsersRole.USER;
        const userRegionId: number | null = isUser ? request.user.regionId : null;

        return this.mainService.getClientCategories(query);
    }

    @Get('statuses-ip')
    getStatusesIP(@Query() query: GetMainParamsDto, @Request() request: AuthenticatedRequest) {
        const role: UsersRole = request.user.role;
        const isUser: boolean = role === UsersRole.USER;
        const userRegionId: number | null = isUser ? request.user.regionId : null;

        return this.mainService.getStatusesIP(query);
    }

    @Get('clients')
    getClients(@Query() query: GetMainParamsDto, @Request() request: AuthenticatedRequest) {
        const role: UsersRole = request.user.role;
        const isUser: boolean = role === UsersRole.USER;
        const isGMU: boolean = role === UsersRole.LIMITED_ADMIN_GMU;
        const userRegionId: number | null = isUser ? request.user.regionId : null;
        query.regionId = userRegionId || query.regionId; ////////////////////////////////// ????????????????????
        return this.mainService.getClients(query, isGMU);
    }
}
