import { Module } from '@nestjs/common';
import { CoreModule } from "../core/core.module";
import { AggregatedStatisticsService } from './aggregated-statistics.service';

@Module({
    imports: [CoreModule],
    providers: [AggregatedStatisticsService],
    exports: [AggregatedStatisticsService],
})
export class AggregatedStatisticsModule {}
