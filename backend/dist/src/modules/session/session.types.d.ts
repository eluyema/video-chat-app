import { SessionSecurity } from './session.enity';
export type PublicSession = {
    shareId: string;
    reusable: boolean;
    isRanning: boolean;
    title: string;
    description: string;
    plannedDate: Date;
    security: SessionSecurity;
    authorEmail: string;
};
export declare enum TwilioRoomStatusEnum {
    INPROGRESS = "in-progress",
    FAILED = "failed",
    COMPLETED = "completed"
}
