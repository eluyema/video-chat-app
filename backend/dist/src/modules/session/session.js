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
exports.CallEventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const decorators_1 = require("@nestjs/websockets/decorators");
const socket_io_1 = require("socket.io");
const connections = {};
const messages = {};
const timeOnline = {};
let CallEventsGateway = class CallEventsGateway {
    constructor() {
        this.users = 0;
    }
    handleConnection(client) {
        console.log(client.id);
    }
    async listenForMessages(content, socket) {
        return 'Hi';
    }
    async onChat(client, message) {
        return 'Hi2';
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CallEventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, decorators_1.MessageBody)()),
    __param(1, (0, decorators_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CallEventsGateway.prototype, "listenForMessages", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CallEventsGateway.prototype, "onChat", null);
CallEventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], CallEventsGateway);
exports.CallEventsGateway = CallEventsGateway;
//# sourceMappingURL=session.js.map