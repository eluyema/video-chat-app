import { PublicUser } from '../user/user.types';
import { CreateSessionDto } from './dtos/createSessionDto';
import { RoomEventsDto } from './dtos/roomEventsDto';
import { UpdateSessionDto } from './dtos/updateSessionDto';
import { SessionService } from './session.service';
import { PublicSession } from './session.types';
export declare class SessionController {
    private sessionService;
    constructor(sessionService: SessionService);
    createSession(req: any, dto: CreateSessionDto): Promise<PublicSession>;
    getMySessions(req: any): Promise<PublicSession[]>;
    getSessionInfo(shareId: any): Promise<PublicSession>;
    removeSession(req: any, shareId: any): Promise<string>;
    updateSession(req: any, shareId: any, dto: UpdateSessionDto): Promise<PublicSession>;
    stopSession(req: any, shareId: any): Promise<void>;
    roomEvents(dto: RoomEventsDto): Promise<void>;
    addApprovedUser(req: any, shareId: any, email: any): Promise<PublicUser>;
    GetApprovedUsers(req: any, shareId: any): Promise<PublicUser[]>;
    deleteApprovedUser(req: any, shareId: any, email: any): Promise<PublicUser>;
}
