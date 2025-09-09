import { DiskStorageFile } from '@blazity/nest-file-fastify';

export type InteractionFilesInfo = {
    firstFile?: DiskStorageFile[];
    secondFile?: DiskStorageFile[];
};

export type InteractionFilesConfig = {
    name: keyof InteractionFilesInfo;
    maxCount: 1;
}[];
