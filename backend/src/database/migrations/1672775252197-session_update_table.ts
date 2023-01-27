import { MigrationInterface, QueryRunner } from "typeorm";

export class sessionUpdateTable1672775252197 implements MigrationInterface {
    name = 'sessionUpdateTable1672775252197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "password"`);
    }

}
