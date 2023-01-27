"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTwilioRoomIdColumnToSession1672708237922 = void 0;
class addTwilioRoomIdColumnToSession1672708237922 {
    constructor() {
        this.name = 'addTwilioRoomIdColumnToSession1672708237922';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "sessions" ADD "twilio_room_id" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "twilio_room_id"`);
    }
}
exports.addTwilioRoomIdColumnToSession1672708237922 = addTwilioRoomIdColumnToSession1672708237922;
//# sourceMappingURL=1672708237922-add_twilio_room_id_column_to_session.js.map