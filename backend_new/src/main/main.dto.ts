import { IsNotEmpty, IsOptional } from 'class-validator';
import { Prisma } from 'src/generated/prisma/client';

export class GetMainParamsDto {
    @IsNotEmpty()
    isDerived: boolean;

    @IsNotEmpty()
    isArchived: boolean;

    @IsOptional()
    regionId: number;
}

export type RegionType = Prisma.RegionsGetPayload<{ omit: { sonoName: true } }>;
