import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilePathToTodo1766123208639 implements MigrationInterface {
    name = 'AddFilePathToTodo1766123208639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo\` ADD \`file_path\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`todo\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`todo\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`todo\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo\` CHANGE \`created_at\` \`created_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`todo\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`todo\` ADD \`description\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`todo\` DROP COLUMN \`file_path\``);
    }

}
