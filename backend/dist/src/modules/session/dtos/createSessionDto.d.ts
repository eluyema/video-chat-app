import { SessionSecurity } from '../session.enity';
export declare class CreateSessionDto {
    readonly reusable: boolean;
    readonly title: string;
    readonly description: string;
    readonly plannedDate: Date;
    readonly security: SessionSecurity;
    readonly password: string;
}
