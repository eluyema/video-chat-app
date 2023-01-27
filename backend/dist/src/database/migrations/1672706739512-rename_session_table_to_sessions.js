"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameSessionTableToSessions1672706739512 = void 0;
class renameSessionTableToSessions1672706739512 {
    constructor() {
        this.name = 'renameSessionTableToSessions1672706739512';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d"`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "share_id" character varying NOT NULL, "reusable" boolean NOT NULL, "is_ranning" boolean NOT NULL, "title" character varying NOT NULL, "description" character varying, "planned_time" TIMESTAMP WITH TIME ZONE, "author_id" uuid, CONSTRAINT "UQ_7adf4e4a911a195cac9fd5757e2" UNIQUE ("share_id"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_8941971a4fab75dff8ead7b5408" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d" FOREIGN KEY ("active_session_id") REFERENCES "sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_8941971a4fab75dff8ead7b5408"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d" FOREIGN KEY ("active_session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.renameSessionTableToSessions1672706739512 = renameSessionTableToSessions1672706739512;
//# sourceMappingURL=1672706739512-rename_session_table_to_sessions.js.map