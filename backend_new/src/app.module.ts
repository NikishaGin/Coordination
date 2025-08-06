import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { MainModule } from './main/main.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        PrismaModule,
        ClientModule,
        UserModule,
        MainModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `${process.cwd()}/.env`,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
