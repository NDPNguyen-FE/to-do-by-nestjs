import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from "typeorm";

export class CreateUserTableAndRelation1766130000000 implements MigrationInterface {
    name = 'CreateUserTableAndRelation1766130000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create User table
        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "createdAt",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        // Add userId column to todo table
        const hasUserId = await queryRunner.hasColumn("todo", "userId");
        if (!hasUserId) {
            await queryRunner.addColumn("todo", new TableColumn({
                name: "userId",
                type: "int",
                isNullable: true
            }));
        }

        // Add foreign key constraint safely
        const table = await queryRunner.getTable("todo");
        const existingForeignKey = table?.foreignKeys.find(fk =>
            fk.columnNames.indexOf("userId") !== -1 &&
            fk.referencedTableName === "user"
        );

        if (!existingForeignKey) {
            await queryRunner.createForeignKey(
                "todo",
                new TableForeignKey({
                    columnNames: ["userId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "user",
                    onDelete: "SET NULL",
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Get foreign key to drop
        const table = await queryRunner.getTable("todo");
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("userId") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("todo", foreignKey);
        }

        // Drop userId column
        await queryRunner.query(`ALTER TABLE \`todo\` DROP COLUMN \`userId\``);

        // Drop user table
        await queryRunner.dropTable("user");
    }
}
