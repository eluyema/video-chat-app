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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("@nestjs/common/utils");
const decorators_1 = require("@nestjs/common/decorators");
const api_config_service_1 = require("../../shared/services/api-config.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, apiConfigService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.apiConfigService = apiConfigService;
    }
    async verifyPassword(hashedPassword, plainTextPassword) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        return isPasswordMatching;
    }
    async getAuthenticatedUser(email, hashedPassword) {
        try {
            const user = await this.userService.findOne(email);
            const plainTextPassword = user.password;
            const verified = await this.verifyPassword(plainTextPassword, hashedPassword);
            if (!verified) {
                return null;
            }
            user.password = undefined;
            return user;
        }
        catch (e) {
            return null;
        }
    }
    getDecodedToken(token) {
        const decoded = this.jwtService.verify(token, {
            secret: this.apiConfigService.authConfig.publicKey,
        });
        return decoded;
    }
    async addAuthCookies(res, user) {
        const payload = { email: user.email, sub: user.id };
        const jwtToken = this.jwtService.sign(payload);
        res.cookie('auth-token', jwtToken, { httpOnly: true });
    }
    async clearAuthCookies(res) {
        res.clearCookie('auth-token');
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, decorators_1.Inject)((0, utils_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        api_config_service_1.ApiConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map