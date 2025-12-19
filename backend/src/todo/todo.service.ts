import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService implements OnModuleInit {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) { }

    onModuleInit() {
        setInterval(() => {
            this.handleCron();
        }, 60000);
    }

    findAll(): Promise<Todo[]> {
        return this.todoRepository.find();
    }

    findOne(id: number): Promise<Todo | null> {
        return this.todoRepository.findOneBy({ id });
    }

    create(todo: Partial<Todo>): Promise<Todo> {
        return this.todoRepository.save(todo);
    }

    async remove(id: number): Promise<void> {
        await this.todoRepository.delete(id);
    }

    async handleCron() {
        const now = new Date();
        await this.todoRepository.update(
            { time: LessThan(now), is_active: true },
            { is_active: false },
        );
    }
}
