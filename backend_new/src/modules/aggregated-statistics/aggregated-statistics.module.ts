import { Module } from '@nestjs/common';
import { AggregatedStatisticsService } from './aggregated-statistics.service';

@Module({
    providers: [AggregatedStatisticsService],
    exports: [AggregatedStatisticsService],
})
export class AggregatedStatisticsModule {}
