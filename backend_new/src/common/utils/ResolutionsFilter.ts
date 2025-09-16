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

export function createDataFilters(
    isDerived: boolean,
    isArchived: boolean
): {
    clientsFilter: Prisma.ClientsWhereInput,
    resolutionsFilter: Prisma.ResolutionsWhereInput,
} {
    const derivedFilter: Prisma.ResolutionsWhereInput = getDerivedFilter(isDerived);
    const archivedFilter: Prisma.ResolutionsWhereInput = getArchivedFilter(isArchived);
    const clientsFilter: Prisma.ClientsWhereInput = {
        isVisible: true,
        resolution: {
            some: {
                isVisible: true,
                ...derivedFilter,
                ...(!isArchived ? archivedFilter : {}),
            },
            ...(isArchived ? { every: archivedFilter } : {}),
        },
    };
    const resolutionsFilter: Prisma.ResolutionsWhereInput = {
        isVisible: true,
        ...derivedFilter,
        ...archivedFilter
    };

    return { clientsFilter, resolutionsFilter };
}