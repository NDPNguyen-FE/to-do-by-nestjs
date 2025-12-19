import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class FixMoreColumns1766125000000 implements MigrationInterface {
    name = 'FixMoreColumns1766125000000'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Check 'isActive'
        const hasIsActive = await queryRunner.hasColumn("todo", "isActive");
        if (!hasIsActive) {
            await queryRunner.addColumn("todo", new TableColumn({
                name: "isActive",
                type: "boolean",
                default: true
            }));
        }

        // Check 'title'
        const hasTitle = await queryRunner.hasColumn("todo", "title");
        if (!hasTitle) {
            await queryRunner.addColumn("todo", new TableColumn({
                name: "title",
                type: "varchar",
                length: "255",
                isNullable: true
            }));
        }

        // Check 'description'
        const hasDesc = await queryRunner.hasColumn("todo", "description");
        if (!hasDesc) {
            await queryRunner.addColumn("todo", new TableColumn({
                name: "description",
                type: "varchar",
                length: "500",
                isNullable: true
            }));
        }

        // Check 'userId' (relation)
        const hasUserId = await queryRunner.hasColumn("todo", "userId");
        if (!hasUserId) {
            await queryRunner.addColumn("todo", new TableColumn({
                name: "userId",
                type: "int",
                isNullable: true
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasIsActive = await queryRunner.hasColumn("todo", "isActive");
        if (hasIsActive) {
            await queryRunner.dropColumn("todo", "isActive");
        }
    }
}
