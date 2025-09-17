import {Controller, Get, Res, Header, Query, UseGuards, Request} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DownloadService } from './download.service';
import { GetDownloadParamsDto } from './download.dto';
import {JwtAuthGuard} from "../../common/guards/auth.guard";
import {AuthenticatedRequest} from "../../common/interfaces/user-request.interface";

@UseGuards(JwtAuthGuard)
@Controller('download')
export class DownloadController {
    constructor(private readonly downloadService: DownloadService) {}

    @Get('common-statistics')
    async getCommonStatistics(@Query() query: GetDownloadParamsDto, @Res() reply: FastifyReply) {
        const buffer = await this.downloadService.getCommonStatistics(query);
        const filename = this.downloadService.generateNameFile('Выгрузка', query.isDerived, query.isArchived)
        reply.header('Content-Disposition', `filename="${filename}"`).send(buffer);
    }

    @Get('resolutions-statistics')
    async getResolutionsStatistics(@Query() query: GetDownloadParamsDto, @Res() reply: FastifyReply) {
        const buffer = await this.downloadService.getResolutionsStatistics(query);
        const filename = this.downloadService.generateNameFile('Выгрузка по ИП', query.isDerived, query.isArchived)
        reply.header('Content-Disposition', `filename="${filename}"`).send(buffer);
    }

    @Get('actives-statistics')
    async getActivesStatistics(@Query() query: GetDownloadParamsDto, @Res() reply: FastifyReply) {
        const buffer = await this.downloadService.getActivesStatistics(query);
        const filename = this.downloadService.generateNameFile('Активы НП', query.isDerived, query.isArchived)
        reply.header('Content-Disposition', `filename="${filename}"`).send(buffer);
    }
}
