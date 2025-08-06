import { Body, Controller, Get, Post } from '@nestjs/common';
import { MainService } from './main.service';
import { MainDto } from './main.dto';

@Controller('main')
export class MainController {
    constructor(private readonly mainService: MainService) {}

    @Get('debtor-categories')
    getDebtorCategories(): Promise<any> {
        return this.mainService.getDebtorCategories();
    }

    @Post('regions')
    getRegions(@Body() data: MainDto): Promise<any> {
        const clientFilter = this.mainService.createClientFilter(data);
        return this.mainService.getRegions(clientFilter);
    }
}
