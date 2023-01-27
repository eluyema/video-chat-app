"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExtraValues1674792165375 = void 0;
class removeExtraValues1674792165375 {
    constructor() {
        this.name = 'removeExtraValues1674792165375';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active_session_id"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "active_session_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_2bd440b8749bbbf89cecd488a6d" FOREIGN KEY ("active_session_id") REFERENCES "sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.removeExtraValues1674792165375 = removeExtraValues1674792165375;
//# sourceMappingURL=1674792165375-remove_extra_values.js.map