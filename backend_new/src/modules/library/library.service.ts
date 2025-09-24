import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {LibraryType} from "../../generated/prisma/enums";

@Injectable()
export class LibraryService {
    constructor(private readonly prisma: PrismaService) {}

    getDocuments(source: LibraryType) {
        return this.prisma.library.findMany({ where: { source } });
    }
}
