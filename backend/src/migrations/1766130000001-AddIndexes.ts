import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddIndexes1766130000001 implements MigrationInterface {
    name = 'AddIndexes1766130000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Helper to safely create index
        const createIndexIfNotExists = async (tableName: string, indexName: string, columnNames: string[]) => {
            const table = await queryRunner.getTable(tableName);
            const existingIndex = table?.indices.find(i => i.name === indexName || (i.columnNames.length === columnNames.length && i.columnNames.every((c, index) => c === columnNames[index])));

            // Check strictly by name first, as error was "Duplicate key name"
            // Actually, if name conflicts, strict check by name is safer to avoid creating duplicate with same name
            const existsByName = table?.indices.find(i => i.name === indexName);

            if (!existsByName) {
                await queryRunner.createIndex(
                    tableName,
                    new TableIndex({
                        name: indexName,
                        columnNames: columnNames,
                    })
                );
            }
        };

        // Index for sorting by createdAt
        await createIndexIfNotExists("todo", "IDX_TODO_CREATED_AT", ["createdAt"]);

        // Composite index for cron job query
        await createIndexIfNotExists("todo", "IDX_TODO_TIME_ACTIVE", ["time", "isActive"]);

        // Index for userId foreign key
        await createIndexIfNotExists("todo", "IDX_TODO_USER_ID", ["userId"]);

        // Index for username lookup
        await createIndexIfNotExists("user", "IDX_USER_USERNAME", ["username"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("todo", "IDX_TODO_CREATED_AT");
        await queryRunner.dropIndex("todo", "IDX_TODO_TIME_ACTIVE");
        await queryRunner.dropIndex("todo", "IDX_TODO_USER_ID");
        await queryRunner.dropIndex("user", "IDX_USER_USERNAME");
    }
}
