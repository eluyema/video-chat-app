"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUnregisteredUsers1672710593934 = void 0;
class addUnregisteredUsers1672710593934 {
    constructor() {
        this.name = 'addUnregisteredUsers1672710593934';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "unregistered_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "socket_id" character varying NOT NULL, "expire_date" TIMESTAMP WITH TIME ZONE, "active_session_id" uuid, CONSTRAINT "PK_c280b1649b923ec26c1c23ebe4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "planned_time"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "planned_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE TYPE "public"."sessions_security_enum" AS ENUM('NONE', 'PERMISSION', 'PASSWORD', 'REGISTRED')`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "security" "public"."sessions_security_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_8941971a4fab75dff8ead7b5408"`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "author_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_8941971a4fab75dff8ead7b5408" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unregistered_users" ADD CONSTRAINT "FK_0d1e4b4230e532f4ba98f1c568e" FOREIGN KEY ("active_session_id") REFERENCES "sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "unregistered_users" DROP CONSTRAINT "FK_0d1e4b4230e532f4ba98f1c568e"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_8941971a4fab75dff8ead7b5408"`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "author_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_8941971a4fab75dff8ead7b5408" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "security"`);
        await queryRunner.query(`DROP TYPE "public"."sessions_security_enum"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "planned_date"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "planned_time" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`DROP TABLE "unregistered_users"`);
    }
}
exports.addUnregisteredUsers1672710593934 = addUnregisteredUsers1672710593934;
//# sourceMappingURL=1672710593934-add_unregistered_users.js.map