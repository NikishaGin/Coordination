import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { InteractionType } from '../generated/prisma/enums';
import { OmitType, PartialType } from '@nestjs/mapped-types';

// prettier-ignore
const transformToBoolean = ({ value }) =>
    ['true', '1'].includes(`${value}`.toLowerCase());

export class GetResolutionsParamsDto {
    @Transform(transformToBoolean) @IsNotEmpty() isDerived: boolean;
    @Transform(transformToBoolean) @IsNotEmpty() isArchived: boolean;
}

export class CreateInteractionDto {
    @IsOptional() @IsEnum(InteractionType) type: InteractionType;
    @IsOptional() @IsDate() submissionDate?: Date;
    @IsOptional() @IsDate() reviewDate?: Date;
    @IsOptional() @IsString() result?: string;
    @IsOptional() @IsString() note?: string;
    @IsOptional() @IsString() originalFilename_1?: string;
    @IsOptional() @IsString() originalFilename_2?: string;
    @IsOptional() @IsInt() tnoId?: number;
}

export class UpdateInteractionDto extends PartialType(
    OmitType(CreateInteractionDto, ['type'] as const),
) {}
