import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MainService } from '../main/main.service';

@Injectable()
export class DownloadService {
    constructor(
        private prisme: PrismaService,
        private main: MainService,
    ) {}

    getStatistics() {
        // this.main.getClients()
    }

    getStatisticsIP() {

    }

    getActiveStatistics() {

    }
}
