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
exports.SessionController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const createSessionDto_1 = require("./dtos/createSessionDto");
const roomEventsDto_1 = require("./dtos/roomEventsDto");
const updateSessionDto_1 = require("./dtos/updateSessionDto");
const session_service_1 = require("./session.service");
let SessionController = class SessionController {
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async createSession(req, dto) {
        const { email } = req.user;
        return this.sessionService.createSession(dto, email);
    }
    async getMySessions(req) {
        const { email } = req.user;
        return this.sessionService.getAllSessionByUser(email);
    }
    async getSessionInfo(shareId) {
        return this.sessionService.getSessionInfo(shareId);
    }
    async removeSession(req, shareId) {
        const { email } = req.user;
        await this.sessionService.removeMySession(shareId, email);
        return shareId;
    }
    async updateSession(req, shareId, dto) {
        const { email } = req.user;
        return this.sessionService.updateMySession(shareId, email, dto);
    }
    async stopSession(req, shareId) {
        const { email } = req.user;
        return this.sessionService.stopMySession(email, shareId);
    }
    async roomEvents(dto) {
        return this.sessionService.onRoomEvent(dto);
    }
    async addApprovedUser(req, shareId, email) {
        const { email: myEmail } = req.user;
        return this.sessionService.addApprovedUser(myEmail, shareId, email);
    }
    async GetApprovedUsers(req, shareId) {
        const { email } = req.user;
        return this.sessionService.getAllApprovedUsers(email, shareId);
    }
    async deleteApprovedUser(req, shareId, email) {
        const { email: myEmail } = req.user;
        return this.sessionService.deleteApprovedUser(myEmail, shareId, email);
    }
};
__decorate([
    (0, decorators_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/'),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, createSessionDto_1.CreateSessionDto]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "createSession", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/all'),
    __param(0, (0, decorators_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getMySessions", null);
__decorate([
    (0, common_1.Get)('/:shareId'),
    __param(0, (0, decorators_1.Param)('shareId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getSessionInfo", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/:shareId'),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Param)('shareId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "removeSession", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, decorators_1.Put)('/:shareId'),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Param)('shareId')),
    __param(2, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, updateSessionDto_1.UpdateSessionDto]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "updateSession", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/stop/:shareId'),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Param)('shareId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "stopSession", null);
__decorate([
    (0, common_1.Post)('/room-events'),
    __param(0, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [roomEventsDto_1.RoomEventsDto]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "roomEvents", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/:shareId/approved-users'),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Param)('shareId')),
    __param(2, (0, decorators_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "addApprovedUser", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/:shareId/approved-users'),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Param)('shareId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "GetApprovedUsers", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/:shareId/approved-users/:email'),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Param)('shareId')),
    __param(2, (0, decorators_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "deleteApprovedUser", null);
SessionController = __decorate([
    (0, common_1.Controller)('sessions'),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], SessionController);
exports.SessionController = SessionController;
//# sourceMappingURL=session.controller.js.map