import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const port = process.env.PORT ?? 3000;
    const host = process.env.HOST ?? '127.0.0.1';
    const origin: string[] = process.env.ORIGIN?.split(',') ?? ['localhost'];

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.enableCors({
        origin: origin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });

    await app.listen(port, host, () => {
        console.log(`Сервер запущен на http://${host}:${port}/ ...`);
    });
}

bootstrap();