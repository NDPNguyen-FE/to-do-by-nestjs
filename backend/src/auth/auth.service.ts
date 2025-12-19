import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async signIn(username: string, pass: string): Promise<any> {
        if (username !== 'admin' || pass !== 'admin') {
            throw new UnauthorizedException();
        }
        const payload = { username: username, sub: 1 };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
