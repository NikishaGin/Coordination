import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

const transformToBoolean = ({ value }) => ['true', '1'].includes(`${value}`.toLowerCase());

export class GetResolutionsParamsDto {
    @Transform(transformToBoolean)
    @IsNotEmpty()
    isDerived: boolean;

    @Transform(transformToBoolean)
    @IsNotEmpty()
    isArchived: boolean;
}