import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    findAll(): Promise<Todo[]> {
        return this.todoService.findAll();
    }

    @Post()
    create(@Body() todo: Partial<Todo>): Promise<Todo> {
        return this.todoService.create(todo);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.todoService.remove(+id);
    }
}
