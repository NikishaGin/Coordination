import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { MainModule } from './main/main.module';

@Module({
    imports: [ClientModule, UserModule, MainModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
