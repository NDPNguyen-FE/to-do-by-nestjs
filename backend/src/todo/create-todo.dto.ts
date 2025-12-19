import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { Transform, Type, Expose } from 'class-transformer';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    title: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    description?: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    time: Date;

    @IsOptional()
    @Expose({ name: 'is_active' })
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return value;
    })
    isActive?: boolean;
}
