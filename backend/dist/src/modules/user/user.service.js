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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_enity_1 = require("./user.enity");
const bcrypt = require("bcrypt");
const exceptions_1 = require("@nestjs/common/exceptions");
const enums_1 = require("@nestjs/common/enums");
const sessions_1 = require("../../utils/mapers/sessions");
const users_1 = require("../../utils/mapers/users");
const auth_service_1 = require("../auth/auth.service");
const utils_1 = require("@nestjs/common/utils");
const decorators_1 = require("@nestjs/common/decorators");
let UserService = class UserService {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    async createUser(userRegisterDto) {
        const existedUser = await this.findOne(userRegisterDto.email);
        if (existedUser) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.CONFLICT,
                error: `User with email "${userRegisterDto.email}" already was registered`,
            }, enums_1.HttpStatus.CONFLICT);
        }
        const passwordHash = await bcrypt.hash(userRegisterDto.password, 10);
        try {
            const user = this.userRepository.create(Object.assign(Object.assign({}, userRegisterDto), { password: passwordHash }));
            await this.userRepository.save(user);
            user.password = undefined;
            return user;
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllSessions(email) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                relations: {
                    createdSessions: true,
                },
            });
            const preparedSessions = user.createdSessions.map((session) => (0, sessions_1.getPublicSession)(Object.assign(Object.assign({}, session), { author: user })));
            return preparedSessions;
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateMyUser(res, email, dto) {
        if (dto.email) {
            const user = await this.findOne(dto.email);
            if (user) {
                throw new exceptions_1.HttpException({
                    status: enums_1.HttpStatus.CONFLICT,
                    error: `User with email "${dto.email}" already was registered`,
                }, enums_1.HttpStatus.CONFLICT);
            }
        }
        const preparedDto = Object.assign({}, dto);
        if (dto.password) {
            const passwordHash = await bcrypt.hash(dto.password, 10);
            preparedDto.password = passwordHash;
        }
        try {
            await this.userRepository.update({ email }, preparedDto);
            if (dto.email) {
                const updatedUser = await this.findOne(dto.email);
                await this.authService.addAuthCookies(res, updatedUser);
                return (0, users_1.getPublicUser)(updatedUser);
            }
            return await this.findPublicUser(email);
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(email) {
        try {
            return this.userRepository.findOneBy({ email });
        }
        catch (e) {
            throw new exceptions_1.HttpException({
                status: enums_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong',
            }, enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findPublicUser(email) {
        return (0, users_1.getPublicUser)(await this.findOne(email));
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_enity_1.default)),
    __param(1, (0, decorators_1.Inject)((0, utils_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map