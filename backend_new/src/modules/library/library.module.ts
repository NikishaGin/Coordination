import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { StorageModule } from "../storage/storage.module";

@Module({
    imports: [StorageModule],
    controllers: [LibraryController],
    providers: [LibraryService],
})
export class LibraryModule {}
