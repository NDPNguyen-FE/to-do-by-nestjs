import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class FixUserSchema1766135000000 implements MigrationInterface {
    name = 'FixUserSchema1766135000000'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Check and fix missing 'createdAt' in user
        const hasCreatedAt = await queryRunner.hasColumn("user", "createdAt");
        if (!hasCreatedAt) {
            await queryRunner.addColumn("user", new TableColumn({
                name: "createdAt",
                type: "datetime",
                default: "CURRENT_TIMESTAMP"
            }));
        }

        // Check password, username just in case
        const hasPassword = await queryRunner.hasColumn("user", "password");
        if (!hasPassword) {
            await queryRunner.addColumn("user", new TableColumn({
                name: "password",
                type: "varchar",
                length: "255"
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasCreatedAt = await queryRunner.hasColumn("user", "createdAt");
        if (hasCreatedAt) {
            await queryRunner.dropColumn("user", "createdAt");
        }
    }
}
