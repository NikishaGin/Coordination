import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { MainModule } from './main/main.module';
import { ActiveModule } from './active/active.module';
import { DownloadModule } from './download/download.module';
import { InteractionModule } from './interaction/interaction.module';
import { IndicatorsModule } from './indicators/indicators.module';
import { LibraryModule } from './library/library.module';

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `${process.cwd()}/.env`,
        }),
        ActiveModule,
        ClientModule,
        DownloadModule,
        InteractionModule,
        IndicatorsModule,
        LibraryModule,
        MainModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
