import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Todo } from './todo.entity';
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
            order: { created_at: 'DESC' }
        });
        return { data, total, page, limit };
    }

    findOne(id: number): Promise<Todo | null> {
        return this.todoRepository.findOneBy({ id });
    }

    create(todo: any): Promise<Todo> {
        return this.todoRepository.save(todo);
    }

    async remove(id: number): Promise<void> {
        await this.todoRepository.delete(id);
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
