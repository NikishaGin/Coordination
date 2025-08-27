import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Prisma } from 'src/generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/edge';

const transformToBoolean = ({ value }) => ['true', '1'].includes(`${value}`.toLowerCase());

export class GetMainParamsDto {
    @Transform(transformToBoolean)
    @IsNotEmpty()
    isDerived: boolean;

    @Transform(transformToBoolean)
    @IsNotEmpty()
    isArchived: boolean;

    @Type(() => Number)
    @IsOptional()
    regionId?: number;
}

export type RegionsType = Prisma.RegionsGetPayload<{ omit: { sonoName: true } }>;

export type AggregatedActivesType = {
    clientId: number;
    totalSum: Decimal | null;
    arrest: Decimal | null;
    wanted: Decimal | null;
    evaluation: Decimal | null;
    realizationFirst: Decimal | null;
    realizationSecond: Decimal | null;
    realizationResult: Decimal | null;
    refundProperty: Decimal | null;
    debitForeclosure: Decimal | null;
};

export type r = {
    COMMON: AggregatedActivesType;
    ACTIVE: AggregatedActivesType;
    DEBIT: AggregatedActivesType;
};

export type ActiveAmountsType = AggregatedActivesType | r;

export type ClientsType = Prisma.ClientsGetPayload<{
    omit: {
        tnoId: true;
        sospId: true;
        categoryId: true;
        isVisible: true;
    };
    include: {
        tno: { select: { CodeTNO: true } };
        sosp: { select: { CodeSOSP: true } };
        category: true;
    };
}> & {
    amounts: {
        resolution: {
            amount: Decimal | null;
            balance: Decimal | null;
        };
        actives: ActiveAmountsType;
    };
    statusIP: string;
    interactionWithGMU?: string;
};
