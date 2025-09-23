import {Controller, Get, Param, Post} from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryType } from "../../generated/prisma/enums";


@Controller('library')
export class LibraryController {
    constructor(private readonly libraryService: LibraryService) {}

    // @Get()
    // getDocuments(@Param('type') type: LibraryType) {
    //     return this.libraryService.getDocuments(type);
    // }
    //
    // @Post(':type')
    // createDocument(
    //     @Param('type') type: LibraryType,
    //     @UploadedFiles() files: LibraryFilesInfo
    // ) {
    //     return this.libraryService.createDocument(type, files);
    // }
}
