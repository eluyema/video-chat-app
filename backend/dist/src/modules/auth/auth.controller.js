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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const user_service_1 = require("../user/user.service");
const auth_service_1 = require("./auth.service");
const UserRegisterDto_1 = require("./dtos/UserRegisterDto");
const local_auth_guard_1 = require("./local-auth.guard");
let AuthController = class AuthController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async userRegister(userRegisterDto, res) {
        const user = await this.userService.createUser(userRegisterDto);
        this.authService.addAuthCookies(res, user);
        return user;
    }
    async login(req, res) {
        this.authService.addAuthCookies(res, req.user);
        return req.user;
    }
    async logout(req, res) {
        this.authService.clearAuthCookies(res);
        res.status(common_1.HttpStatus.OK).json();
    }
};
__decorate([
    (0, common_1.Post)('/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRegisterDto_1.UserRegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userRegister", null);
__decorate([
    (0, decorators_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('/login'),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/logout'),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map