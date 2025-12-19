import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        // Seed admin user if not exists
        const adminExists = await this.findOne('admin');
        if (!adminExists) {
            console.log('Seeding admin user...');
            const hashedPassword = await bcrypt.hash('admin', 10);
            await this.usersRepository.save({
                username: 'admin',
                password: hashedPassword,
            });
            console.log('Admin user seeded successfully');
        }
    }

    async findOne(username: string): Promise<User | undefined> {
        const user = await this.usersRepository.findOne({ where: { username } });
        return user || undefined;
    }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(userData);
        return this.usersRepository.save(newUser);
    }
}
