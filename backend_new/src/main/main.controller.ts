import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { MainService } from './main.service';
import { MainDto } from './main.dto';

@Controller('main')
export class MainController {
    constructor(private readonly mainService: MainService) {}

    @Get('client-categories')
    getClientCategories(
        @Query(new ValidationPipe()) query: MainDto,
    ): Promise<any> {
        return this.mainService.getClientCategories(query);
    }

    @Get()
    getStatusesIP() {

    }

    @Get('regions')
    getRegions(@Body() data: MainDto): Promise<any> {
        const clientFilter = this.mainService.createClientFilter(data);
        return this.mainService.getRegions(clientFilter);
    }

    @Get('clients')
    getClients(@Param() data: MainDto): Promise<any> {
        const clientFilter = this.mainService.createClientFilter(data);
        return this.mainService.getClients(data.regionId, clientFilter);
    }
}
