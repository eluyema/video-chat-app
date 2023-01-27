import { UserService } from '../user/user.service';
import { Repository } from 'typeorm/repository/Repository';
import SessionEntity from './session.enity';
import { CreateSessionDto } from './dtos/createSessionDto';
import { PublicSession } from './session.types';
import { TwilioService } from 'nestjs-twilio';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { JoinRoomDto } from './dtos/joinRoomDto';
import { UpdateSessionDto } from './dtos/updateSessionDto';
import { AuthService } from '../auth/auth.service';
import { StartRoomDto } from './dtos/startRoomDto';
import { RoomEventsDto } from './dtos/roomEventsDto';
import { Server, Socket } from 'socket.io';
import { AnswerPermissionDto } from './dtos/answerPermissionDto';
import { DeclineAskingPermissionDto } from './dtos/declineAskingPermissionDto';
import { SendMessageToRoomDto } from './dtos/sendMessageToRoomDto';
export declare class SessionService {
    private sessionRepository;
    private readonly userService;
    private readonly twilioService;
    private readonly appConfigService;
    private readonly authService;
    constructor(sessionRepository: Repository<SessionEntity>, userService: UserService, twilioService: TwilioService, appConfigService: ApiConfigService, authService: AuthService);
    createSession(sessionDto: CreateSessionDto, email: string): Promise<PublicSession>;
    getAllSessionByUser(email: string): Promise<PublicSession[]>;
    updateMySession(myShareId: string, email: string, dto: UpdateSessionDto): Promise<PublicSession>;
    removeMySession(myShareId: string, email: string): Promise<void>;
    addApprovedUser(myEmail: string, shareId: string, userEmail: string): Promise<import("../user/user.types").PublicUser>;
    getAllApprovedUsers(myEmail: any, shareId: any): Promise<import("../user/user.types").PublicUser[]>;
    deleteApprovedUser(myEmail: any, shareId: any, userEmail: any): Promise<import("../user/user.types").PublicUser>;
    getSessionInfo(shareId: string): Promise<PublicSession>;
    getUniqueShortId(maxTryCount: any): Promise<string>;
    getTwilioAccessToken(roomName: any, identity: any): {
        videoToken: string;
        roomName: any;
    };
    findOrCreateRoom(roomName: any): Promise<import("twilio/lib/rest/video/v1/room").RoomInstance>;
    declineAskingPermission(socket: Socket, dto: DeclineAskingPermissionDto): Promise<void>;
    answerPermission(io: Server, socket: Socket, token: string | undefined, dto: AnswerPermissionDto): Promise<void>;
    startSession(token: string | undefined, dto: StartRoomDto): Promise<{
        videoToken: string;
        roomName: any;
    }>;
    joinToSession(socket: Socket, token: string | undefined, dto: JoinRoomDto): Promise<{
        videoToken: string;
        roomName: any;
    }>;
    onRoomEvent(dto: RoomEventsDto): Promise<void>;
    sendMessageToRoom(socket: Socket, dto: SendMessageToRoomDto): Promise<void>;
    stopMySession(email: any, shareId: any): Promise<void>;
    joinCall(shareId: string, displayName: string, email?: string): Promise<{
        videoToken: string;
        roomName: any;
    }>;
    startCall(shareId: string, displayName: string, email: string): Promise<{
        videoToken: string;
        roomName: any;
    }>;
}
