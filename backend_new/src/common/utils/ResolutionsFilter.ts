import { Prisma } from 'src/generated/prisma/client';

export function getDerivedFilter(isDerived: boolean): Prisma.ResolutionsWhereInput {
    return { isDerived };
}

export function getArchivedFilter(isArchived: boolean): Prisma.ResolutionsWhereInput {
    const logicalOperator: 'OR' | 'AND' = isArchived ? 'OR' : 'AND';
    const isExistsDate: Partial<{ not: null; equals: null }> = isArchived
        ? { not: null }
        : { equals: null };
    return {
        [logicalOperator]: [
            { isArchived: isArchived },
            { WritExecutionEndDate: isExistsDate },
            { WritExecutionTerminateDate: isExistsDate },
        ],
    };
}
