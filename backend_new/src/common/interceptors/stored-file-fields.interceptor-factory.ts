import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@blazity/nest-file-fastify';
import { FileStorageService } from '../../storage/storage.service';

@Injectable()
export class StoredFileFieldsInterceptor implements NestInterceptor {
    private interceptor: NestInterceptor;

    constructor(
        private readonly storageService: FileStorageService,
        private fields: { name: string; maxCount: number }[],
    ) {
        const InterceptorClass = FileFieldsInterceptor(this.fields, {
            storage: this.storageService.storage,
        });
        this.interceptor = new InterceptorClass();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
        return this.interceptor.intercept(context, next);
    }
}


import { applyDecorators, UseInterceptors, Injectable, Type } from '@nestjs/common';
import { FileFieldsInterceptor } from '@blazity/nest-file-fastify';
import { FileStorageService } from '../../storage/storage.service';
import { InteractionFilesConfig } from '../types';


function StoredFileFieldsInterceptorFactory(
    fields: { name: string; maxCount: number }[],
): Type<any> {
    @Injectable()
    class StoredFileFieldsInterceptorBound {
        constructor(private readonly storageService: FileStorageService) {}

        // Nest сам вызовет intercept через FileFieldsInterceptor внутри
        interceptor = FileFieldsInterceptor(fields, {
            storage: this.storageService.storage,
        })();
    }

    return StoredFileFieldsInterceptorBound;
}

// Декоратор, который возвращает UseInterceptors с фабрикой
export function UseFileFields(fields: InteractionFilesConfig) {
    const InterceptorClass = StoredFileFieldsInterceptorFactory(fields);
    return applyDecorators(UseInterceptors(InterceptorClass));
}
