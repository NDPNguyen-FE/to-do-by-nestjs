import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFilePathToTodo1766123208639 implements MigrationInterface {
    name = 'AddFilePathToTodo1766123208639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Safe check for filePath
        const hasFilePath = await queryRunner.hasColumn("todo", "filePath");
        if (!hasFilePath) {
            await queryRunner.addColumn("todo", new TableColumn({
                name: "filePath",
                type: "varchar",
                length: "255",
                isNullable: true
            }));
        }

        // Logic for description (resize 500 -> 255, destructive if not careful)
        // Only run if column exists
        const hasDescription = await queryRunner.hasColumn("todo", "description");
        if (hasDescription) {
            // We use changeColumn to be safer than DROP/ADD
            await queryRunner.changeColumn("todo", "description", new TableColumn({
                name: "description",
                type: "varchar",
                length: "255",
                isNullable: false
            }));
        } else {
            // If missing, add it
            await queryRunner.addColumn("todo", new TableColumn({
                name: "description",
                type: "varchar",
                length: "255",
                isNullable: false
            }));
        }

        // Fix createdAt precision
        const hasCreatedAt = await queryRunner.hasColumn("todo", "createdAt");
        if (hasCreatedAt) {
            // Check current column type if possible, or just force update
            await queryRunner.changeColumn("todo", "createdAt", new TableColumn({
                name: "createdAt",
                type: "datetime",
                precision: 6,
                default: "CURRENT_TIMESTAMP(6)",
                isNullable: false
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo\` CHANGE \`createdAt\` \`createdAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`todo\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`todo\` ADD \`description\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`todo\` DROP COLUMN \`filePath\``);
    }

}
