import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

const transformToBoolean = ({ value }) => ['true', '1'].includes(`${value}`.toLowerCase());
const transformToArrayInt = ({ value }) => value && value.split(',').map(Number);

export class GetDownloadParamsDto {
    @Transform(transformToBoolean)
    @IsNotEmpty()
    isDerived: boolean;

    @Transform(transformToBoolean)
    @IsNotEmpty()
    isArchived: boolean;

    @Transform(transformToArrayInt)
    @IsOptional()
    clientIds: number[];
}
