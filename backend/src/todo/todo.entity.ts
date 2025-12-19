import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../users/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
@Index(['createdAt']) // For ORDER BY createdAt
@Index(['time', 'isActive']) // For cron job query
@Index(['userId']) // For user relation joins
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'datetime' })
    time: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    filePath: string;

    @ManyToOne(() => User, (user) => user.todos)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    @Exclude()
    userId: number;

    @Expose()
    get fileUrl(): string | null {
        if (!this.filePath) return null;
        // Assuming the file path stored is relative or just filename. 
        // If it's just filename, we prepend /uploads/. 
        // If it's a path like 'uploads/file.png', we ensure format.
        // Let's assume filePath stores 'filename.ext' or 'uploads/filename.ext'.
        // Based on Multer config usually it might store path.
        // Let's rely on consistency. If it starts with 'http', return as is.
        if (this.filePath.startsWith('http')) return this.filePath;

        // Use environment variable or constant for base URL in a real app.
        // For now, relative path for frontend to handle or full path if we knew host.
        // Better: Return the static path served by NestJS.
        const path = this.filePath.replace(/\\/g, '/'); // Normalize slashes
        return `${process.env.VITE_API_URL || 'http://localhost:3000'}/uploads/${path}`;
    }
}
