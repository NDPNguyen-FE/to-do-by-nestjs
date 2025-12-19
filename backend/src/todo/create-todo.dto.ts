import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsNotEmpty()
    time: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return value;
    })
    is_active?: boolean;
}
