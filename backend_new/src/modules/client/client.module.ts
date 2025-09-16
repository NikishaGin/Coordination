import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ActiveModule } from '../active/active.module';
import { StorageModule } from "../storage/storage.module";

@Module({
    imports: [ActiveModule, StorageModule],
    controllers: [ClientController],
    providers: [ClientService],
})
export class ClientModule {}
