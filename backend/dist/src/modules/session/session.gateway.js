"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionGateway = void 0;
const pipes_1 = require("@nestjs/common/pipes");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const decorators_1 = require("@nestjs/websockets/decorators");
const socket_io_1 = require("socket.io");
const joinRoomDto_1 = require("./dtos/joinRoomDto");
const session_service_1 = require("./session.service");
const cookie_1 = require("../../utils/server/cookie");
const startRoomDto_1 = require("./dtos/startRoomDto");
const wsException_filter_1 = require("../../filters/wsException.filter");
const answerPermissionDto_1 = require("./dtos/answerPermissionDto");
const declineAskingPermissionDto_1 = require("./dtos/declineAskingPermissionDto");
const sendMessageToRoomDto_1 = require("./dtos/sendMessageToRoomDto");
let SessionGateway = class SessionGateway {
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    handleConnection(client) {
        console.log(client.id);
    }
    async startCall(dto, socket) {
        const token = (0, cookie_1.getCookie)(socket.handshake.headers.cookie, 'auth-token');
        const { videoToken, roomName } = await this.sessionService.startSession(token, dto);
        socket.join(roomName);
        return {
            event: 'success-join',
            data: { videoToken, roomName },
        };
    }
    async joinToRoom(dto, socket) {
        const token = (0, cookie_1.getCookie)(socket.handshake.headers.cookie, 'auth-token');
        const { videoToken, roomName } = await this.sessionService.joinToSession(socket, token, dto);
        if (videoToken) {
            return {
                event: 'success-join',
                data: { videoToken, roomName },
            };
        }
    }
    async answerPermission(dto, socket) {
        const token = (0, cookie_1.getCookie)(socket.handshake.headers.cookie, 'auth-token');
        await this.sessionService.answerPermission(this.server, socket, token, dto);
    }
    async declineAsking(dto, socket) {
        await this.sessionService.declineAskingPermission(socket, dto);
    }
    async sendMessageToRoom(dto, socket) {
        await this.sessionService.sendMessageToRoom(socket, dto);
    }
    async ping(socket) {
        return { event: 'pong' };
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SessionGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('start-call'),
    __param(0, (0, decorators_1.MessageBody)()),
    __param(1, (0, decorators_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [startRoomDto_1.StartRoomDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "startCall", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-room'),
    __param(0, (0, decorators_1.MessageBody)()),
    __param(1, (0, decorators_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [joinRoomDto_1.JoinRoomDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "joinToRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('answer-permission'),
    __param(0, (0, decorators_1.MessageBody)()),
    __param(1, (0, decorators_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [answerPermissionDto_1.AnswerPermissionDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "answerPermission", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('decline-asking-permission'),
    __param(0, (0, decorators_1.MessageBody)()),
    __param(1, (0, decorators_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [declineAskingPermissionDto_1.DeclineAskingPermissionDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "declineAsking", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-message-to-room'),
    __param(0, (0, decorators_1.MessageBody)()),
    __param(1, (0, decorators_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sendMessageToRoomDto_1.SendMessageToRoomDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "sendMessageToRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, decorators_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "ping", null);
SessionGateway = __decorate([
    (0, common_1.UsePipes)(new pipes_1.ValidationPipe({
        transform: true,
    })),
    (0, common_1.UseFilters)(wsException_filter_1.WebsocketExceptionsFilter),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], SessionGateway);
exports.SessionGateway = SessionGateway;
//# sourceMappingURL=session.gateway.js.map