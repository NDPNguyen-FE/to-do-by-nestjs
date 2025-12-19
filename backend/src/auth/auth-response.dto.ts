import { Expose } from 'class-transformer';

export class AuthResponseDto {
    @Expose()
    access_token: string;

    constructor(partial: Partial<AuthResponseDto>) {
        Object.assign(this, partial);
    }
}
