import { MigrationInterface, QueryRunner } from "typeorm";
export declare class removeExtraValues1674792165375 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
