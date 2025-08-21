import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Prisma } from '../generated/prisma/client';

const transformToBoolean = ({ value }) => ['true', '1'].includes(`${value}`.toLowerCase());

export class GetResolutionsParamsDto {
    @Transform(transformToBoolean)
    @IsNotEmpty()
    isDerived: boolean;

    @Transform(transformToBoolean)
    @IsNotEmpty()
    isArchived: boolean;

    @Type(() => Number)
    clientId: number;
}

export type RegionType = Prisma.ResolutionsGetPayload<{ omit: { sonoName: true } }>;
