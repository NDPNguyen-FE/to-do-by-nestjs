import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    ParseIntPipe,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { TodoQueryDto } from './todo-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaginatedResponse } from './todo.types';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    /**
     * Get all todos with filtering and pagination
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() query: TodoQueryDto, @Request() req): Promise<PaginatedResponse<Todo>> {
        return this.todoService.findAll(query, req.user.id);
    }

    /**
     * Get statistics
     */
    @Get('stats/overview')
    @HttpCode(HttpStatus.OK)
    async getStatistics(@Request() req): Promise<{
        total: number;
        active: number;
        expired: number;
    }> {
        return this.todoService.getStatistics(req.user.id);
    }

    /**
     * Get a single todo by ID
     */
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
        return this.todoService.findOne(id);
    }

    /**
     * Get a single todo by ID
     */


    /**
     * Create a new todo
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    }))
    async create(
        @Body() createTodoDto: CreateTodoDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                ],
                fileIsRequired: false,
            }),
        ) file: Express.Multer.File | undefined,
        @Request() req,
    ): Promise<Todo> {
        if (file) {
            return this.todoService.create(
                { ...createTodoDto, filePath: file.path },
                req.user
            );
        }
        return this.todoService.create(createTodoDto, req.user);
    }

    /**
     * Update a todo
     */
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTodoDto: UpdateTodoDto,
        @Request() req,
    ): Promise<Todo> {
        return this.todoService.update(id, updateTodoDto, req.user.id);
    }

    /**
     * Soft delete a todo (set isActive to false)
     */
    @Delete(':id/soft')
    @HttpCode(HttpStatus.NO_CONTENT)
    async softRemove(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ): Promise<void> {
        return this.todoService.softRemove(id, req.user.id);
    }

    /**
     * Permanently delete a todo
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ): Promise<void> {
        return this.todoService.remove(id, req.user.id);
    }
}
