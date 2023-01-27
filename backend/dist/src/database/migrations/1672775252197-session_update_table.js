"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionUpdateTable1672775252197 = void 0;
class sessionUpdateTable1672775252197 {
    constructor() {
        this.name = 'sessionUpdateTable1672775252197';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "sessions" ADD "password" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "password"`);
    }
}
exports.sessionUpdateTable1672775252197 = sessionUpdateTable1672775252197;
//# sourceMappingURL=1672775252197-session_update_table.js.map