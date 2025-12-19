import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './auth.types';
import { AuthResponseDto } from './auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) { }

    async signIn(username: string, pass: string): Promise<AuthResponseDto> {
        const user = await this.usersService.findOne(username);
        if (!user || !(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username: user.username, sub: user.id };
        return new AuthResponseDto({
            access_token: this.jwtService.sign(payload),
        });
    }
}
