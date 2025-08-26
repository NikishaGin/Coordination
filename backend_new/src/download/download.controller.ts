import { Controller, Get, Res, Header, Query } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DownloadService } from './download.service';
import { GetDownloadParamsDto } from './download.dto';

@Controller('download')
export class DownloadController {
    constructor(private readonly downloadService: DownloadService) {}

    @Get('common-statistics')
    getCommonStatistics(@Query() query: GetDownloadParamsDto) {}

    @Get('resolutions-statistics')
    getResolutionsStatistics(@Query() query: GetDownloadParamsDto) {}

    @Get('actives-statistics')
    getActivesStatistics(@Query() query: GetDownloadParamsDto) {}
}
