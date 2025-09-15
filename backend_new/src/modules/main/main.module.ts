import { Module } from '@nestjs/common';
import { MainService } from './main.service';
import { MainController } from './main.controller';
import { AggregatedStatisticsModule } from "../aggregated-statistics/aggregated-statistics.module";

@Module({
    imports: [AggregatedStatisticsModule],
    controllers: [MainController],
    providers: [MainService],
})
export class MainModule {}
