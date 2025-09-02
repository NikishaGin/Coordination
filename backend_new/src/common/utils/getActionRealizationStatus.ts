import { Prisma } from 'src/generated/prisma/client';

export function getActionRealizationStatus(realization: Prisma.RealizationsGetPayload<{}>): string {
    return realization.realizationDate !== null ? 'Завершено' : 'Не завершено';
}