import path from 'node:path';
import 'dotenv/config';
import type { PrismaConfig } from 'prisma';

export default {
    schema: path.join('db', 'schema.prisma'),
    migrations: {
        path: path.join('db', 'migrations'),
    },
    typedSql: {
        path: path.join('db', 'queries'),
    },
} satisfies PrismaConfig;
