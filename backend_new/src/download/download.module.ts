import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { ExcelModule } from './excel/excel.module';
import { MainModule } from '../main/main.module';

@Module({
    imports: [ExcelModule, MainModule],
    controllers: [DownloadController],
    providers: [DownloadService],
})
export class DownloadModule {}
