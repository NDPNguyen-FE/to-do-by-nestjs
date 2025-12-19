import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'datetime' })
    time: Date;

    @CreateDateColumn()
    created_at: Date;

    @Column({ nullable: true })
    file_path: string;
}
