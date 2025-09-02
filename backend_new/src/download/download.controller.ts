import { Controller, Get, Res, Header, Query } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DownloadService } from './download.service';
import { GetDownloadParamsDto } from './download.dto';

@Controller('download')
export class DownloadController {
    constructor(private readonly downloadService: DownloadService) {}

    @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    @Get('common-statistics')
    async getCommonStatistics(
        @Query() query: GetDownloadParamsDto,
        @Res() reply: FastifyReply,
    ) {
        const buffer = await this.downloadService.getCommonStatistics(query);
        reply
            .header('Content-Disposition', 'attachment; filename="report.xlsx"')
            .send(buffer);

    }

    @Get('resolutions-statistics')
    async getResolutionsStatistics(@Query() query: GetDownloadParamsDto) {}

    @Get('actives-statistics')
    async getActivesStatistics(@Query() query: GetDownloadParamsDto) {}
}
