import { Module } from '@nestjs/common';
import { MainService } from './main.service';
import { MainController } from './main.controller';
import { ClientModule } from '../client/client.module';

@Module({
    imports: [ClientModule],
    controllers: [MainController],
    providers: [MainService],
})
export class MainModule {}
