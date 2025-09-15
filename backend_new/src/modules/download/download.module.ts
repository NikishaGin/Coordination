import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { ExcelModule } from './excel/excel.module';
import { AggregatedStatisticsModule } from "../aggregated-statistics/aggregated-statistics.module";

@Module({
    imports: [ExcelModule, AggregatedStatisticsModule],
    controllers: [DownloadController],
    providers: [DownloadService],
})
export class DownloadModule {}
