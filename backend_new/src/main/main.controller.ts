import { Controller, Get, Query } from '@nestjs/common';
import { MainService } from './main.service';
import { GetMainParamsDto, RegionType } from './main.dto';
import { ClientCategories } from '../generated/prisma/client';

@Controller('main')
export class MainController {
    constructor(private readonly mainService: MainService) {}

    @Get('regions')
    getRegions(@Query() query: GetMainParamsDto): Promise<RegionType[]> {
        return this.mainService.getRegions(query);
    }

    @Get('categories')
    getClientCategories(
        @Query() query: GetMainParamsDto,
    ): Promise<ClientCategories[]> {
        return this.mainService.getClientCategories(query);
    }

    /*
    @Get('statuses-ip')
    getStatusesIP(@Query() query: GetMainParamsDto): Promise<string[]> {
        return this.mainService.getStatusesIP(query);
    }
     */

    @Get('clients')
    getClients(@Query() query: GetMainParamsDto): Promise<any> {
        return this.mainService.getClients(query);
    }
}
