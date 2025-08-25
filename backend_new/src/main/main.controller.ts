import { Controller, Get, Query, Request } from '@nestjs/common';
import { MainService } from './main.service';
import { GetMainParamsDto, RegionType } from './main.dto';
import { ClientCategories } from '../generated/prisma/client';
import { AuthenticatedRequest } from '../common/interfaces/user-request.interface';
import { UsersRole } from '../generated/prisma/enums';

@Controller('main')
export class MainController {
    constructor(private readonly mainService: MainService) {}

    @Get('regions')
    getRegions(
        @Query() query: GetMainParamsDto,
        @Request() request: AuthenticatedRequest,
    ): Promise<RegionType[]> {

        return this.mainService.getRegions(query);
    }

    @Get('categories')
    getClientCategories(
        @Query() query: GetMainParamsDto,
        @Request() request: AuthenticatedRequest,
    ): Promise<ClientCategories[]> {
        return this.mainService.getClientCategories(query);
    }

    @Get('statuses-ip')
    getStatusesIP(
        @Query() query: GetMainParamsDto,
        @Request() request: AuthenticatedRequest,
    ): Promise<string[]> {
        return this.mainService.getStatusesIP(query);
    }

    @Get('clients')
    getClients(
        @Query() query: GetMainParamsDto,
        @Request() request: AuthenticatedRequest,
    ): Promise<any> {
        const role: UsersRole = request.user.role;
        return this.mainService.getClients(query, role);
    }
}
