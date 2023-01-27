import { MigrationInterface, QueryRunner } from "typeorm";
export declare class renameSessionTableToSessions1672706739512 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
