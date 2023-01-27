import { BaseEntity } from 'typeorm';
import UserEntity from '../user/user.enity';
export declare enum SessionSecurity {
    NONE = "NONE",
    PERMISSION = "PERMISSION",
    PASSWORD = "PASSWORD",
    REGISTRED = "REGISTRED"
}
export default class SessionEntity extends BaseEntity {
    id: string;
    shareId: string;
    reusable: boolean;
    isRanning: boolean;
    title: string;
    description: string;
    twilioRoomId: string;
    plannedDate: Date;
    security: SessionSecurity;
    password: string;
    author: UserEntity;
    approvedParticipants: UserEntity[];
}
