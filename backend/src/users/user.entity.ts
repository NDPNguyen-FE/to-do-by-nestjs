import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Todo } from '../todo/todo.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    @Exclude() // Hide password in response
    password: string;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[];

    @CreateDateColumn()
    createdAt: Date;
}
