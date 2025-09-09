import { Controller, Get, Param, Post, UploadedFiles } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryType } from '../generated/prisma/enums';
import { LibraryFilesInfo } from './types';

// prettier-ignore
@Controller('library')
export class LibraryController {
    constructor(private readonly libraryService: LibraryService) {}

    @Get()
    getDocuments(@Param('type') type: LibraryType) {
        return this.libraryService.getDocuments(type);
    }

    @Post(':type')
    createDocument(
        @Param('type') type: LibraryType,
        @UploadedFiles() files: LibraryFilesInfo
    ) {
        return this.libraryService.createDocument(type, files);
    }
}
