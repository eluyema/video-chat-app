import { MigrationInterface, QueryRunner } from "typeorm";

export class removeExtraValues1674792165375 implements MigrationInterface {
    name = 'removeExtraValues1674792165375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active_session_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "active_session_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d" FOREIGN KEY ("active_session_id") REFERENCES "sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
