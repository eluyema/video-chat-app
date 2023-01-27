import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class CallEventsGateway implements OnGatewayConnection {
    handleConnection(client: any): void;
    server: Server;
    users: number;
    listenForMessages(content: string, socket: Socket): Promise<string>;
    onChat(client: any, message: any): Promise<string>;
}
