import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class FixMissingFilePath1766150000000 implements MigrationInterface {
    name = 'FixMissingFilePath1766150000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Fix missing 'filePath' column if previous migration failed silent or was skipped
        const hasColumn = await queryRunner.hasColumn("todo", "filePath");
        if (!hasColumn) {
            await queryRunner.addColumn("todo", new TableColumn({
                name: "filePath",
                type: "varchar",
                length: "255",
                isNullable: true
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.hasColumn("todo", "filePath");
        if (hasColumn) {
            await queryRunner.dropColumn("todo", "filePath");
        }
    }
}
