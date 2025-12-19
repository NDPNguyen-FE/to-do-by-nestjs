import { Injectable, NotFoundException, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Like, FindOptionsWhere } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from '../users/user.entity';
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { PaginatedResponse } from './todo.types';
import { TodoQueryDto } from './todo-query.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs/promises';

@Injectable()
export class TodoService {
    private readonly logger = new Logger(TodoService.name);

    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
    ) { }

    /**
     * Find all todos with advanced filtering, sorting, and pagination
     */
    /**
     * Find all todos for a specific user with filtering, sorting, and pagination
     */
    async findAll(query: TodoQueryDto, userId: number): Promise<PaginatedResponse<Todo>> {
        const {
            page = 1,
            limit = 10,
            isActive,
            search,
            sortBy = 'createdAt',
            sortOrder = 'DESC',
        } = query;

        // Optimized query builder: No Joins, specific selects
        const queryBuilder = this.todoRepository.createQueryBuilder('todo')
            .select([
                'todo.id',
                'todo.title',
                'todo.description',
                'todo.isActive',
                'todo.time',
                'todo.createdAt',
                'todo.filePath',
                'todo.userId',
            ])
            .where('todo.userId = :userId', { userId });

        // Apply filters
        if (isActive !== undefined) {
            queryBuilder.andWhere('todo.isActive = :isActive', { isActive });
        }

        if (search) {
            queryBuilder.andWhere(
                '(todo.title LIKE :search OR todo.description LIKE :search)',
                { search: `%${search}%` }
            );
        }

        // Apply sorting
        queryBuilder.orderBy(`todo.${sortBy}`, sortOrder);

        // Apply pagination
        queryBuilder.skip((page - 1) * limit).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }

    /**
     * Find one todo by ID
     */
    async findOne(id: number, userId?: number): Promise<Todo> {
        // Select specific fields + userId for ownership check
        const todo = await this.todoRepository.findOne({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                isActive: true,
                time: true,
                createdAt: true,
                filePath: true,
                userId: true, // Need this for ownership check logic
            },
        });

        if (!todo) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
        }

        // Check ownership if userId is provided
        if (userId && todo.userId !== userId) {
            throw new ForbiddenException('You can only access your own todos');
        }

        // Note: In strict Typescript with TypeORM, deleting property might trigger type error if not handled.
        // For high performance, we can just return it or use DTO transformation.

        return todo;
    }

    /**
     * Create a new todo with fail-safe file cleanup
     */
    async create(
        createTodoDto: CreateTodoDto | (CreateTodoDto & { filePath: string }),
        user: User
    ): Promise<Todo> {
        try {
            const todo = this.todoRepository.create({
                ...createTodoDto,
                user, // TypeORM needs relation or ID to save
            });

            const savedTodo = await this.todoRepository.save(todo);
            this.logger.log(`Todo created: ${savedTodo.id} by user: ${user.username}`);

            // Reuse findOne to return consistent clean response
            return this.findOne(savedTodo.id);
        } catch (error) {
            this.logger.error(`Failed to create todo: ${error.message}`, error.stack);

            // Clean up uploaded file if database save fails
            if ('filePath' in createTodoDto && createTodoDto.filePath) {
                try {
                    await fs.unlink(createTodoDto.filePath);
                    this.logger.log(`Cleaned up orphaned file: ${createTodoDto.filePath}`);
                } catch (unlinkError) {
                    this.logger.error(`Failed to delete orphaned file: ${unlinkError.message}`);
                }
            }
            throw error;
        }
    }

    /**
     * Update a todo
     */
    async update(id: number, updateTodoDto: UpdateTodoDto, userId: number): Promise<Todo> {
        // Use findOne to check existence AND ownership efficiently
        const todo = await this.findOne(id, userId);

        Object.assign(todo, updateTodoDto);
        // Important: When saving, TypeORM might complain if we stripped userId but relations are not loaded.
        // But since we just updating scalar fields, it should be fine.
        // However, 'delete todo.userId' in findOne might cause issue for save() if we reuse that object directly for updates logic involving foreign keys, 
        // but here we just update fields. 
        // Better safety: To avoid side effects of deleting prop on entity, let's keep it simple.

        await this.todoRepository.update(id, updateTodoDto); // More efficient than save() for partial updates
        this.logger.log(`Todo updated: ${id}`);

        return this.findOne(id);
    }

    /**
     * Soft delete (set isActive to false instead of hard delete)
     */
    async softRemove(id: number, userId: number): Promise<void> {
        await this.findOne(id, userId); // Check existence and ownership
        await this.todoRepository.update(id, { isActive: false });
        this.logger.log(`Todo soft deleted: ${id}`);
    }

    /**
     * Hard delete (permanent removal)
     */
    async remove(id: number, userId: number): Promise<void> {
        const todo = await this.findOne(id, userId); // Check existence and ownership

        await this.todoRepository.delete(id);

        // Clean up associated file if exists
        if (todo.filePath) {
            try {
                await fs.unlink(todo.filePath);
                this.logger.log(`Deleted associated file: ${todo.filePath}`);
            } catch (error) {
                this.logger.warn(`Could not delete file ${todo.filePath}: ${error.message}`);
            }
        }

        this.logger.log(`Todo permanently deleted: ${id}`);
    }

    /**
     * Batch update expired todos (Cron job)
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async handleExpiredTodos(): Promise<void> {
        try {
            const now = new Date();
            const result = await this.todoRepository.update(
                { time: LessThan(now), isActive: true },
                { isActive: false },
            );

            if (result.affected && result.affected > 0) {
                this.logger.log(`Deactivated ${result.affected} expired todos`);
            }
        } catch (error) {
            this.logger.error(`Failed to process expired todos: ${error.message}`, error.stack);
        }
    }

    /**
     * Get todos count by status
     */
    async getStatistics(userId?: number): Promise<{
        total: number;
        active: number;
        expired: number;
    }> {
        const where: FindOptionsWhere<Todo> = {};
        if (userId) {
            where.userId = userId;
        }

        const [total, active, expired] = await Promise.all([
            this.todoRepository.count({ where }),
            this.todoRepository.count({ where: { ...where, isActive: true } }),
            this.todoRepository.count({ where: { ...where, isActive: false } }),
        ]);

        return { total, active, expired };
    }
}
