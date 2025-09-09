import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { InteractionType } from '../generated/prisma/enums';

export class CreateDocumentDto {
    @IsOptional() @IsEnum(InteractionType) type: InteractionType;
    @IsOptional() @IsDate() submissionDate?: Date;
    @IsOptional() @IsDate() reviewDate?: Date;
    @IsOptional() @IsString() result?: string;
    @IsOptional() @IsString() note?: string;
    @IsOptional() @IsInt() tnoId?: number;
}
