import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dtos/joinRoomDto';
import { SessionService } from './session.service';
import { StartRoomDto } from './dtos/startRoomDto';
import { AnswerPermissionDto } from './dtos/answerPermissionDto';
import { DeclineAskingPermissionDto } from './dtos/declineAskingPermissionDto';
import { SendMessageToRoomDto } from './dtos/sendMessageToRoomDto';
export declare class SessionGateway implements OnGatewayConnection {
    private readonly sessionService;
    server: Server;
    constructor(sessionService: SessionService);
    handleConnection(client: Socket): void;
    startCall(dto: StartRoomDto, socket: Socket): Promise<{
        event: string;
        data: {
            videoToken: string;
            roomName: any;
        };
    }>;
    joinToRoom(dto: JoinRoomDto, socket: Socket): Promise<{
        event: string;
        data: {
            videoToken: string;
            roomName: any;
        };
    }>;
    answerPermission(dto: AnswerPermissionDto, socket: Socket): Promise<void>;
    declineAsking(dto: DeclineAskingPermissionDto, socket: Socket): Promise<void>;
    sendMessageToRoom(dto: SendMessageToRoomDto, socket: Socket): Promise<void>;
    ping(socket: Socket): Promise<{
        event: string;
    }>;
}
