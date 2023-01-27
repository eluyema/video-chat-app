import { MigrationInterface, QueryRunner } from "typeorm";
export declare class addSessionTable1672706142237 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
