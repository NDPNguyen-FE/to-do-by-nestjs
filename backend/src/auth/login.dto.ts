import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
