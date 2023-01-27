import { MigrationInterface, QueryRunner } from "typeorm";

export class addSessionTable1672706142237 implements MigrationInterface {
    name = 'addSessionTable1672706142237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "share_id" character varying NOT NULL, "reusable" boolean NOT NULL, "is_ranning" boolean NOT NULL, "title" character varying NOT NULL, "description" character varying, "planned_time" TIMESTAMP WITH TIME ZONE, "author_id" uuid, CONSTRAINT "UQ_0fe966d9b5f9602d777465ebc78" UNIQUE ("share_id"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "active_session_id" uuid`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_c2fd45a59418dbb98e88c8f8137" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d" FOREIGN KEY ("active_session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_c2fd45a59418dbb98e88c8f8137"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active_session_id"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
