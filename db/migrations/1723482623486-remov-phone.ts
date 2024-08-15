import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovPhone1723482623486 implements MigrationInterface {
    name = 'RemovPhone1723482623486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
    }

}
