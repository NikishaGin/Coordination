import { ValidationPipe } from '@nestjs/common';
import compress from '@fastify/compress';
import { NestFactory } from '@nestjs/core';
import multipart from '@fastify/multipart';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    const configService = app.get(ConfigService);
    const host = configService.get<string>('HOST');
    const port = configService.get<number>('PORT');
    const origins = configService.get('ORIGINS').split(',') ?? [];

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

    await app.register(compress);
    await app.register(multipart);

    await app.listen({ port, host }, () => {
        console.log(`Сервер запущен на http://${host}:${port}/ ...`);
    });
}

bootstrap();
