import { MigrationInterface, QueryRunner } from "typeorm";

export class addTwilioRoomIdColumnToSession1672708237922 implements MigrationInterface {
    name = 'addTwilioRoomIdColumnToSession1672708237922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ADD "twilio_room_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "twilio_room_id"`);
    }

}
