import { Controller, Get, Res, Header } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DownloadService } from './download.service';

@Controller('download')
export class DownloadController {
    constructor(private readonly downloadService: DownloadService) {}

    @Get('statistics')
    getStatistics() {}

    @Get('resolutions-statistics')
    getResolutionsStatistics() {}

    @Get('actives-statistics')
    getActivesStatistics() {}
}
