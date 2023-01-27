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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const typeorm_1 = require("@nestjs/typeorm");
const Repository_1 = require("typeorm/repository/Repository");
const session_enity_1 = require("./session.enity");
const shortid = require("shortid");
const enums_1 = require("@nestjs/common/enums");
const exceptions_1 = require("@nestjs/common/exceptions");
const session_types_1 = require("./session.types");
const sessions_1 = require("../../utils/mapers/sessions");
const nestjs_twilio_1 = require("nestjs-twilio");
const twilio_1 = require("twilio");
const api_config_service_1 = require("../../shared/services/api-config.service");
const uuid_1 = require("uuid");
const auth_service_1 = require("../auth/auth.service");
const utils_1 = require("@nestjs/common/utils");
const decorators_1 = require("@nestjs/common/decorators");
const bcrypt = require("bcrypt");
const users_1 = require("../../utils/mapers/users");
const AccessToken = twilio_1.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
let SessionService = class SessionService {
    constructor(sessionRepository, userService, twilioService, appConfigService, authService) {
        this.sessionRepository = sessionRepository;
        this.userService = userService;
        this.twilioService = twilioService;
        this.appConfigService = appConfigService;
        this.authService = authService;
    }
    async createSession(sessionDto, email) {
        const user = await this.userService.findOne(email);
        if (!user) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.PRECONDITION_FAILED,
                error: 'User do not exist',
            }, enums_1.HttpStatus.PRECONDITION_FAILED);
        }
        const shareId = await this.getUniqueShortId(10);
        const sessionValues = Object.assign(Object.assign({}, sessionDto), { shareId, isRanning: false });
        if (!sessionDto.password &&
            sessionDto.security === session_enity_1.SessionSecurity.PASSWORD) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (sessionDto.password) {
            sessionValues.password = await bcrypt.hash(sessionDto.password, 10);
        }
        const session = this.sessionRepository.create(Object.assign({}, sessionValues));
        session.author = user;
        await this.sessionRepository.save(session);
        const createdSession = await this.sessionRepository.findOne({
            relations: {
                author: true,
            },
            where: {
                shareId,
            },
        });
        return (0, sessions_1.getPublicSession)(createdSession);
    }
    async getAllSessionByUser(email) {
        const sessions = await this.userService.getAllSessions(email);
        return sessions;
    }
    async updateMySession(myShareId, email, dto) {
        const sessions = await this.userService.getAllSessions(email);
        const isSessionExist = sessions.some(({ shareId }) => myShareId === shareId);
        if (!isSessionExist) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.NOT_FOUND,
                error: 'Session not found',
            }, enums_1.HttpStatus.NOT_FOUND);
        }
        if (!dto.password && dto.security === session_enity_1.SessionSecurity.PASSWORD) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        let password = undefined;
        if (dto.password && dto.security === session_enity_1.SessionSecurity.PASSWORD) {
            password = await bcrypt.hash(dto.password, 10);
        }
        try {
            await this.sessionRepository.update({ shareId: myShareId }, Object.assign(Object.assign({}, dto), { password }));
            return (0, sessions_1.getPublicSession)(await this.sessionRepository.findOne({
                relations: {
                    author: true,
                },
                where: {
                    shareId: myShareId,
                },
            }));
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeMySession(myShareId, email) {
        const sessions = await this.userService.getAllSessions(email);
        const session = sessions.find(({ shareId }) => myShareId === shareId);
        if (!session) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.NOT_FOUND,
                error: 'Session not found',
            }, enums_1.HttpStatus.NOT_FOUND);
        }
        try {
            try {
                await this.stopMySession(email, myShareId);
            }
            catch (_a) { }
            await this.sessionRepository.delete({ shareId: myShareId });
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addApprovedUser(myEmail, shareId, userEmail) {
        try {
            const session = await this.sessionRepository.findOne({
                relations: {
                    author: true,
                    approvedParticipants: true,
                },
                where: {
                    shareId,
                },
            });
            if (session.author.email !== myEmail) {
                throw new Error();
            }
            const user = await this.userService.findOne(userEmail);
            session.approvedParticipants.push(user);
            await this.sessionRepository.save(session);
            return (0, users_1.getPublicUser)(user);
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllApprovedUsers(myEmail, shareId) {
        try {
            const session = await this.sessionRepository.findOne({
                relations: {
                    author: true,
                    approvedParticipants: true,
                },
                where: {
                    shareId,
                },
            });
            if (session.author.email !== myEmail) {
                throw new Error();
            }
            return session.approvedParticipants.map((user) => (0, users_1.getPublicUser)(user));
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteApprovedUser(myEmail, shareId, userEmail) {
        try {
            const session = await this.sessionRepository.findOne({
                relations: {
                    author: true,
                    approvedParticipants: true,
                },
                where: {
                    shareId,
                },
            });
            if (session.author.email !== myEmail) {
                throw new Error();
            }
            const user = await this.userService.findOne(userEmail);
            if (!user) {
                throw new Error();
            }
            const isSessionContain = session.approvedParticipants.some(({ email }) => email === userEmail);
            if (!isSessionContain) {
                throw new Error();
            }
            session.approvedParticipants = session.approvedParticipants.filter(({ email }) => email !== userEmail);
            await this.sessionRepository.save(session);
            return (0, users_1.getPublicUser)(user);
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSessionInfo(shareId) {
        try {
            const session = await this.sessionRepository.findOne({
                relations: {
                    author: true,
                },
                where: {
                    shareId,
                },
            });
            const publicSession = (0, sessions_1.getPublicSession)(session);
            return publicSession;
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.NOT_FOUND,
                error: 'Session not found',
            }, enums_1.HttpStatus.NOT_FOUND);
        }
    }
    async getUniqueShortId(maxTryCount) {
        for (let tryCount = 0; tryCount < maxTryCount; tryCount++) {
            const shareId = shortid.generate();
            const existedSession = await this.sessionRepository.findOneBy({
                shareId,
            });
            if (!existedSession) {
                return shareId;
            }
        }
        throw new exceptions_1.HttpException({
            status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Something went wrong',
        }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    getTwilioAccessToken(roomName, identity) {
        const token = new AccessToken(...this.appConfigService.twilioAccessTokenConfig, { identity });
        const videoGrant = new VideoGrant({
            room: roomName,
        });
        token.addGrant(videoGrant);
        return { videoToken: token.toJwt(), roomName };
    }
    async findOrCreateRoom(roomName) {
        try {
            const room = await this.twilioService.client.video.rooms(roomName).fetch();
            return room;
        }
        catch (error) {
            return await this.twilioService.client.video.rooms.create({
                uniqueName: roomName,
                maxParticipantDuration: 3600,
                unusedRoomTimeout: 1,
                emptyRoomTimeout: 1,
                type: 'group',
            });
        }
    }
    async declineAskingPermission(socket, dto) {
        const { shareId } = dto;
        try {
            const session = await this.sessionRepository.findOneBy({ shareId });
            if (session && session.twilioRoomId) {
                socket
                    .to(session.twilioRoomId)
                    .emit('decline-asking-permission', { socketId: socket.id });
            }
        }
        catch (_a) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Session Not Found',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async answerPermission(io, socket, token, dto) {
        const session = await this.sessionRepository.findOne({
            where: {
                shareId: dto.shareId,
            },
            relations: {
                author: true,
            },
        });
        if (!token || !session || !session.isRanning) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            const decoded = this.authService.getDecodedToken(token);
            const user = await this.userService.findOne(decoded.email);
            if (!user || user.email !== session.author.email) {
                throw new Error();
            }
            if (dto.approved) {
                const participantData = JSON.parse(dto.identity);
                const data = await this.joinCall(dto.shareId, participantData.displayName, participantData.email);
                io.sockets.sockets.get(dto.socketId).join(data.roomName);
                socket.to(dto.socketId).emit('success-join', data);
            }
            else {
                socket.to(dto.socketId).emit('denied-join');
            }
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async startSession(token, dto) {
        const session = await this.sessionRepository.findOne({
            where: {
                shareId: dto.shareId,
            },
            relations: {
                author: true,
            },
        });
        if (!token || !session || session.isRanning) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            const decoded = this.authService.getDecodedToken(token);
            const user = await this.userService.findOne(decoded.email);
            if (!user || user.email !== session.author.email) {
                throw new Error();
            }
            const displayName = `${user.firstName} ${user.lastName}`;
            return this.startCall(dto.shareId, displayName, user.email);
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async joinToSession(socket, token, dto) {
        const session = await this.sessionRepository.findOne({
            where: {
                shareId: dto.shareId,
            },
            relations: {
                author: true,
            },
        });
        if (!session || !session.isRanning) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        let displayName = dto.displayName;
        let email = undefined;
        let registered = false;
        try {
            const decoded = this.authService.getDecodedToken(token);
            const user = await this.userService.findOne(decoded.email);
            if (user) {
                registered = true;
                displayName = `${user.firstName} ${user.lastName}`;
                email = user.email;
                if (session.author.email === user.email) {
                    const data = await this.joinCall(dto.shareId, displayName, email);
                    socket.join(data.roomName);
                    return data;
                }
            }
        }
        catch (e) {
            if (!displayName) {
                throw new exceptions_1.HttpException({
                    status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Something went wrong',
                }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        switch (session.security) {
            case session_enity_1.SessionSecurity.NONE: {
                const data = await this.joinCall(dto.shareId, displayName, email);
                socket.join(data.roomName);
                return data;
            }
            case session_enity_1.SessionSecurity.PASSWORD: {
                const verified = await this.authService.verifyPassword(session.password, dto.password);
                if (!verified) {
                    throw new exceptions_1.HttpException({
                        status: enums_1.HttpStatus.FORBIDDEN,
                        error: 'Password is wrong',
                    }, enums_1.HttpStatus.FORBIDDEN);
                }
                const data = await this.joinCall(dto.shareId, displayName, email);
                socket.join(data.roomName);
                return data;
            }
            case session_enity_1.SessionSecurity.REGISTRED: {
                if (!registered) {
                    throw new exceptions_1.HttpException({
                        status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Something went wrong',
                    }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                const data = await this.joinCall(dto.shareId, displayName, email);
                socket.join(data.roomName);
                return data;
            }
            case session_enity_1.SessionSecurity.PERMISSION: {
                if (!session.twilioRoomId) {
                    throw new exceptions_1.HttpException({
                        status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: `Room doesn't setted for session`,
                    }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                const identityData = { displayName, email };
                const identity = JSON.stringify(identityData);
                socket.to(session.twilioRoomId).emit('ask-permission', {
                    socketId: socket.id,
                    identity,
                });
                return { videoToken: '', roomName: session.twilioRoomId };
            }
            default: {
                throw new exceptions_1.HttpException({
                    status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Something went wrong',
                }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async onRoomEvent(dto) {
        const isAuthorizated = this.appConfigService.twilioConfig.options.accountSid === dto.AccountSid;
        if (!isAuthorizated) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.UNAUTHORIZED,
                error: 'Not Authorizated',
            }, enums_1.HttpStatus.UNAUTHORIZED);
        }
        if (dto.RoomStatus === session_types_1.TwilioRoomStatusEnum.INPROGRESS) {
            return;
        }
        const session = await this.sessionRepository.findOneBy({
            twilioRoomId: dto.RoomName,
        });
        if (!session) {
            return;
        }
        if (!session.reusable) {
            await this.sessionRepository.delete({ shareId: session.shareId });
        }
        else {
            session.isRanning = false;
            session.twilioRoomId = null;
            await this.sessionRepository.save(session);
        }
    }
    async sendMessageToRoom(socket, dto) {
        try {
            const session = await this.sessionRepository.findOneBy({
                shareId: dto.shareId,
            });
            if (!session.twilioRoomId) {
                throw new Error();
            }
            if (socket.rooms.has(session.twilioRoomId)) {
                socket.to(session.twilioRoomId).emit('message-recieve', {
                    displayName: dto.displayName,
                    message: dto.message,
                });
            }
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.NOT_FOUND,
                error: 'Session not found',
            }, enums_1.HttpStatus.NOT_FOUND);
        }
    }
    async stopMySession(email, shareId) {
        const session = await this.sessionRepository.findOne({
            where: {
                shareId: shareId,
            },
            relations: {
                author: true,
            },
        });
        if (!session) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.NOT_FOUND,
                error: 'Session not found',
            }, enums_1.HttpStatus.NOT_FOUND);
        }
        if (session.author.email !== email) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.UNAUTHORIZED,
                error: 'This session is not your',
            }, enums_1.HttpStatus.UNAUTHORIZED);
        }
        if (!session.isRanning || !session.twilioRoomId) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.BAD_REQUEST,
                error: 'This session is not running',
            }, enums_1.HttpStatus.BAD_REQUEST);
        }
        await this.twilioService.client.video
            .rooms(session.twilioRoomId)
            .update({ status: 'completed' })
            .then((room) => console.log(room.uniqueName));
    }
    async joinCall(shareId, displayName, email) {
        try {
            const session = await this.sessionRepository.findOneBy({ shareId });
            if (!session || !session.isRanning) {
                throw new Error();
            }
            const room = await this.findOrCreateRoom(session.twilioRoomId);
            const data = { displayName, email };
            const newIdentity = JSON.stringify(data);
            const connectedParticipants = await room.participants().list();
            const participant = connectedParticipants.find(({ identity }) => identity === newIdentity);
            if (participant) {
                if (email) {
                    const deletedParticipant = await this.twilioService.client.video
                        .rooms(session.twilioRoomId)
                        .participants(participant.sid)
                        .update({ status: 'disconnected' });
                }
                else {
                    throw new Error('Identity already exist');
                }
            }
            return this.getTwilioAccessToken(session.twilioRoomId, newIdentity);
        }
        catch (e) {
            if (e instanceof Error && e.message === 'Identity already exist') {
                throw new exceptions_1.HttpException({
                    status: enums_1.HttpStatus.CONFLICT,
                    error: 'This user already connected',
                }, enums_1.HttpStatus.CONFLICT);
            }
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async startCall(shareId, displayName, email) {
        try {
            const session = await this.sessionRepository.findOneBy({ shareId });
            if (!session || session.isRanning) {
                throw new Error();
            }
            const twilioId = (0, uuid_1.v4)();
            session.twilioRoomId = twilioId;
            session.isRanning = true;
            await this.sessionRepository.save(session);
            await this.findOrCreateRoom(twilioId);
            const data = { displayName, email };
            const identity = JSON.stringify(data);
            return this.getTwilioAccessToken(twilioId, identity);
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_enity_1.default)),
    __param(4, (0, decorators_1.Inject)((0, utils_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [Repository_1.Repository,
        user_service_1.UserService,
        nestjs_twilio_1.TwilioService,
        api_config_service_1.ApiConfigService,
        auth_service_1.AuthService])
], SessionService);
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map