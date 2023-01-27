import { ValidationPipe } from '@nestjs/common/pipes';
import { UsePipes, UseFilters } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dtos/joinRoomDto';
import { SessionService } from './session.service';
import { getCookie } from 'src/utils/server/cookie';
import { StartRoomDto } from './dtos/startRoomDto';
import { WebsocketExceptionsFilter } from 'src/filters/wsException.filter';
import { AnswerPermissionDto } from './dtos/answerPermissionDto';
import { DeclineAskingPermissionDto } from './dtos/declineAskingPermissionDto';
import { SendMessageToRoomDto } from './dtos/sendMessageToRoomDto';

@UsePipes(
  new ValidationPipe({
    transform: true,
  }),
)
@UseFilters(WebsocketExceptionsFilter)
export class SessionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sessionService: SessionService) {}

  handleConnection(client: Socket) {
    console.log(client.id);
  }

  @SubscribeMessage('start-call')
  async startCall(
    @MessageBody() dto: StartRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const token = getCookie(socket.handshake.headers.cookie, 'auth-token');
    const { videoToken, roomName } = await this.sessionService.startSession(
      token,
      dto,
    );
    socket.join(roomName);
    return {
      event: 'success-join',
      data: { videoToken, roomName },
    };
  }

  @SubscribeMessage('join-room')
  async joinToRoom(
    @MessageBody() dto: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const token = getCookie(socket.handshake.headers.cookie, 'auth-token');
    const { videoToken, roomName } = await this.sessionService.joinToSession(
      socket,
      token,
      dto,
    );
    if (videoToken) {
      return {
        event: 'success-join',
        data: { videoToken, roomName },
      };
    }
  }

  @SubscribeMessage('answer-permission')
  async answerPermission(
    @MessageBody() dto: AnswerPermissionDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const token = getCookie(socket.handshake.headers.cookie, 'auth-token');
    await this.sessionService.answerPermission(this.server, socket, token, dto);
  }

  @SubscribeMessage('decline-asking-permission')
  async declineAsking(
    @MessageBody() dto: DeclineAskingPermissionDto,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.sessionService.declineAskingPermission(socket, dto);
  }

  @SubscribeMessage('send-message-to-room')
  async sendMessageToRoom(
    @MessageBody() dto: SendMessageToRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.sessionService.sendMessageToRoom(socket, dto);
  }

  @SubscribeMessage('ping')
  async ping(@ConnectedSocket() socket: Socket) {
    return { event: 'pong' };
  }
}
