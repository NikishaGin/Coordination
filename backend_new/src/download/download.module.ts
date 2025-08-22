import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { MainModule } from '../main/main.module';

@Module({
    imports: [MainModule],
    controllers: [DownloadController],
    providers: [DownloadService],
})
export class DownloadModule {}
