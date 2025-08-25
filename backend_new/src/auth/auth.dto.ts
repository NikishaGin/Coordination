import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
    @IsNotEmpty({ message: 'Обязательное поле' })
    @IsString()
    @Transform(({ value }) => value?.replace(/\s+/g, ' ').trim())
    username: string;

    @IsNotEmpty({ message: 'Обязательное поле' })
    @IsString()
    @Transform(({ value }) => value?.replace(/\s+/g, ' ').trim())
    password: string;
}
