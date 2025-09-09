import { FileStorageService } from '../../storage/storage.service';
import { StoredFileFieldsInterceptor } from '../interceptors/stored-file-fields.interceptor';
import { UseInterceptors } from '@nestjs/common';

export const UseFileFields = (fields: { name: string; maxCount: number }[]) => {
    const fieldsBounded = class extends StoredFileFieldsInterceptor {
        constructor(storageService: FileStorageService) {
            super(storageService, fields);
        }
    };
    return UseInterceptors(fieldsBounded);
};
