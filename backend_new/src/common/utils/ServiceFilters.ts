import { Prisma } from 'src/generated/prisma/client';

function createDerivedFilter(isDerived: boolean): Prisma.ResolutionsWhereInput {
    return { isDerived };
}

function createArchivedFilter(isArchived: boolean): Prisma.ResolutionsWhereInput {
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

export function createServiceFilters(
    isDerived: boolean,
    isArchived: boolean
): {
    clientsFilter: Prisma.ClientsWhereInput,
    resolutionsFilter: Prisma.ResolutionsWhereInput,
} {
    const derivedFilter: Prisma.ResolutionsWhereInput = createDerivedFilter(isDerived);
    const archivedFilter: Prisma.ResolutionsWhereInput = createArchivedFilter(isArchived);
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