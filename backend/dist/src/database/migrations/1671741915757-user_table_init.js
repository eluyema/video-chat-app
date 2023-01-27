"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTableInit1671741915757 = void 0;
class userTableInit1671741915757 {
    constructor() {
        this.name = 'userTableInit1671741915757';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.userTableInit1671741915757 = userTableInit1671741915757;
//# sourceMappingURL=1671741915757-user_table_init.js.map