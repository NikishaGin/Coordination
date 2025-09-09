import { DiskStorageFile } from '@blazity/nest-file-fastify';

export type LibraryFilesInfo = {
    file?: DiskStorageFile[]; // Для унификации подхода
};
