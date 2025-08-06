import { IsNotEmpty, IsOptional } from 'class-validator';

export class MainDto {
    @IsNotEmpty()
    isDerived: boolean;

    @IsNotEmpty()
    isArchived: boolean;

    @IsOptional()
    regionId: number;
}
