import { ValidationPipe } from '@nestjs/common';
import compress from '@fastify/compress';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as path from "node:path";
import * as process from "node:process";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    const configService = app.get(ConfigService);
    const host = configService.get<string>('HOST');
    const port = configService.get<number>('PORT');
    const origins = configService.get('ORIGINS').split(',') || [];
    const storageName = configService.get('STORAGE_PATH') || './storage/';

    app.setGlobalPrefix('api');
    app.enableCors({
        origin: origins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: false,
            transform: true,
        }),
    );

    app.useStaticAssets({
        root: path.join(process.cwd(), storageName),
        prefix: storageName.replaceAll('.', ''),
    });

    await app.register(compress);

    await app.listen({ port, host }, () => {
        console.log(`Сервер запущен на http://${host}:${port}/ ...`);
    });
}

bootstrap();
