import { SessionSecurity } from '../session.enity';
export declare class UpdateSessionDto {
    readonly title: string;
    readonly description: string;
    readonly plannedDate: Date;
    readonly security: SessionSecurity;
    readonly password: string;
}
