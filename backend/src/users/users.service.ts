import { Injectable, OnModuleInit, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        // Seed admin user if not exists
        const adminExists = await this.findOne('admin');
        if (!adminExists) {
            this.logger.log('Seeding admin user...');
            const hashedPassword = await bcrypt.hash('admin', 10);
            await this.usersRepository.save({
                username: 'admin',
                password: hashedPassword,
            });
            this.logger.log('Admin user seeded successfully');
        }
    }

    async findOne(username: string): Promise<User | undefined> {
        const user = await this.usersRepository.findOne({ where: { username } });
        return user || undefined;
    }

    async findById(id: number): Promise<User | undefined> {
        const user = await this.usersRepository.findOne({ where: { id } });
        return user || undefined;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { username, password } = createUserDto;

        // Check if user exists
        const existingUser = await this.findOne(username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = this.usersRepository.create({
            username,
            password: hashedPassword,
        });

        try {
            return await this.usersRepository.save(newUser);
        } catch (error) {
            this.logger.error(`Failed to register user: ${error.message}`, error.stack);
            throw error;
        }
    }
}
