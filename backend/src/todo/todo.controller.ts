import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, UsePipes, ValidationPipe, ParseIntPipe, DefaultValuePipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Request } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateTodoDto } from './create-todo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('todo')
@UseGuards(AuthGuard('jwt'))
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.todoService.findAll(page, limit);
    }

    @Post()
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
    create(
        @Body() createTodoDto: CreateTodoDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    // Optional: new FileTypeValidator({ fileType: 'image/jpeg' }),
                ],
                fileIsRequired: false,
            }),
        ) file: Express.Multer.File,
        @Request() req,
    ): Promise<Todo> {
        if (file) {
            return this.todoService.create({ ...createTodoDto, file_path: file.path }, req.user);
        }
        return this.todoService.create(createTodoDto, req.user);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.todoService.remove(id);
    }
}
