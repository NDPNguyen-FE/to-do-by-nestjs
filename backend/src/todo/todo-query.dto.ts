import { IsOptional, IsInt, Min, IsString, IsIn, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TodoQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return value;
    })
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    search?: string;

    @IsOptional()
    @IsIn(['createdAt', 'time', 'title'])
    sortBy?: 'createdAt' | 'time' | 'title' = 'createdAt';

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
