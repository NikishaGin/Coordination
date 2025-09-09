import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LibraryType } from '../generated/prisma/enums';
import { LibraryFilesInfo } from './types';

@Injectable()
export class LibraryService {
    constructor(private readonly prisma: PrismaService) {}

    getDocuments(type: LibraryType) {
        return this.prisma.library.findMany({
            where: { source: type },
        });
    }

    createDocument(type: LibraryType, files: LibraryFilesInfo) {
        return this.prisma.library.create({
            data: { source: type, ...this._extractFilenames(files) },
        });
    }

    _extractFilenames(files: LibraryFilesInfo) {
        const { file: [fileSource] = [] } = files;
        const { originalFilename, filename: systemsFilename } = fileSource;
        return { originalFilename, systemsFilename };
    }
}
