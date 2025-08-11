import { Body, Controller, Get, Post } from '@nestjs/common';
import { MainService } from './main.service';
import { MainDto } from './main.dto';

@Controller('main')
export class MainController {
    constructor(private readonly mainService: MainService) {}

    /*
    @Get('client-categories')
    getClientCategories(): Promise<any> {
        return this.mainService.getClientCategories();
    }
     */

     */

    @Post('regions')
    getRegions(@Body() data: MainDto): Promise<any> {
        const clientFilter = this.mainService.createClientFilter(data);
        return this.mainService.getRegions(clientFilter);
    }

    @Post('clients')
    getClients(@Body() data: MainDto): Promise<any> {
        const clientFilter = this.mainService.createClientFilter(data);
        return this.mainService.getClients(data.regionId, clientFilter);
    }
}
