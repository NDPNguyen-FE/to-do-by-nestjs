import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from '../users/user.entity';
import { CreateTodoDto } from './create-todo.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) { }

    async findAll(page: number = 1, limit: number = 10): Promise<{ data: Todo[], total: number, page: number, limit: number }> {
        const [data, total] = await this.todoRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { created_at: 'DESC' },
            relations: ['user'],
        });
        return { data, total, page, limit };
    }

    findOne(id: number): Promise<Todo | null> {
        return this.todoRepository.findOneBy({ id });
    }

    async create(createTodoDto: CreateTodoDto | (CreateTodoDto & { file_path: string }), user: User): Promise<Todo> {
        return this.todoRepository.save({ ...createTodoDto, user });
    }

    async remove(id: number): Promise<void> {
        const result = await this.todoRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
        }
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        const now = new Date();
        await this.todoRepository.update(
            { time: LessThan(now), is_active: true },
            { is_active: false },
        );
    }
}
