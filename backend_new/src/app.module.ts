import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { MainModule } from './modules/main/main.module';
import { ActiveModule } from './modules/active/active.module';
import { DownloadModule } from './modules/download/download.module';
import { InteractionModule } from './modules/interaction/interaction.module';
import { IndicatorsModule } from './modules/indicators/indicators.module';
import { LibraryModule } from './modules/library/library.module';

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
        InteractionModule,
        IndicatorsModule,
        LibraryModule,
        MainModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
