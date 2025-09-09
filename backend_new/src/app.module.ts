import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { MainModule } from './main/main.module';
import { ActiveModule } from './active/active.module';
import { DownloadModule } from './download/download.module';
import { IndicatorsModule } from './indicators/indicators.module';
import { LibraryModule } from './library/library.module';

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `${process.cwd()}/.env`,
        }),
        AuthModule,
        ActiveModule,
        ClientModule,
        DownloadModule,
        IndicatorsModule,
        LibraryModule,
        MainModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
