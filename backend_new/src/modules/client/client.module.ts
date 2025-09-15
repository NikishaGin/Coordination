import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ActiveModule } from '../active/active.module';

@Module({
    imports: [ActiveModule],
    controllers: [ClientController],
    providers: [ClientService],
})
export class ClientModule {}
