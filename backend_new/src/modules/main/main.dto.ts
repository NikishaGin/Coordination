import {IsNotEmpty, IsOptional} from 'class-validator';
import {Transform, Type} from 'class-transformer';

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
