import {Controller, Get, Res, Query, UseGuards} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DownloadService } from './download.service';
import { GetDownloadParamsDto } from './download.dto';
import {JwtAuthGuard} from "../../common/guards/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('download')
export class DownloadController {
    constructor(private readonly downloadService: DownloadService) {}

    @Get('common-statistics')
    async getCommonStatistics(@Query() query: GetDownloadParamsDto, @Res() reply: FastifyReply) {
        const buffer = await this.downloadService.getCommonStatistics(query);
        const filename = this.downloadService.generateNameFile('Выгрузка', query.isDerived, query.isArchived);
        reply
            .header('Content-Type', 'application/octet-stream')
            .header('Content-Disposition', `filename="${filename}"`)
            .header('Access-Control-Expose-Headers', 'Content-Disposition')
            .send(buffer);
    }

    @Get('resolutions-statistics')
    async getResolutionsStatistics(@Query() query: GetDownloadParamsDto, @Res() reply: FastifyReply) {
        const buffer = await this.downloadService.getResolutionsStatistics(query);
        const filename = this.downloadService.generateNameFile('Выгрузка по ИП', query.isDerived, query.isArchived);
        reply
            .header('Content-Type', 'application/octet-stream')
            .header('Content-Disposition', `filename="${filename}"`)
            .header('Access-Control-Expose-Headers', 'Content-Disposition')
            .send(buffer);
    }

    @Get('actives-statistics')
    async getActivesStatistics(@Query() query: GetDownloadParamsDto, @Res() reply: FastifyReply) {
        const buffer = await this.downloadService.getActivesStatistics(query);
        const filename = this.downloadService.generateNameFile('Активы НП', query.isDerived, query.isArchived);
        reply
            .header('Content-Type', 'application/octet-stream')
            .header('Content-Disposition', `filename="${filename}"`)
            .header('Access-Control-Expose-Headers', 'Content-Disposition')
            .send(buffer);
    }
}
