import { DataSource } from 'typeorm';
import { Todo } from './src/todo/todo.entity';
import { User } from './src/users/user.entity';

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'todo_db',
    entities: [Todo, User],
    migrations: ['src/migrations/*.ts'],
});
