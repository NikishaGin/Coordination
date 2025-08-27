import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Prisma } from 'src/generated/prisma/client';

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
    totalSum: number;
    arrest: number;
    wanted: number;
    evaluation: number;
    realizationFirst: number;
    realizationSecond: number;
    realizationResult: number;
    refundProperty: number;
    debitForeclosure: number;
};
