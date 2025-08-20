import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { LogOptions } from 'src/generated/prisma/internal/class';
import { PrismaClientOptions } from 'src/generated/prisma/internal/prismaNamespace';

@Injectable()
export class PrismaService
    extends PrismaClient<PrismaClientOptions, LogOptions<PrismaClientOptions>>
    implements OnModuleInit, OnModuleDestroy
{
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
