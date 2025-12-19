import { IsOptional, IsString, IsBoolean, IsNotEmpty, MinLength, MaxLength, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateTodoDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    time?: Date;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return value;
    })
    isActive?: boolean;
}
