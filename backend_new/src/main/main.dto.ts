import {IsNotEmpty, IsOptional} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {Prisma} from 'src/generated/prisma/client';
import {Decimal} from '@prisma/client/runtime/edge';

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
