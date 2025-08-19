import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'src/generated/prisma/client';
import { LogOptions } from 'src/generated/prisma/internal/class';
import { PrismaClientOptions } from 'src/generated/prisma/internal/prismaNamespace';

@Injectable()
export class PrismaService
    extends PrismaClient<PrismaClientOptions, LogOptions<PrismaClientOptions>>
    implements OnModuleInit, OnModuleDestroy
{
    constructor() {
        super({
            adapter: new PrismaMariaDb({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
            }),
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
