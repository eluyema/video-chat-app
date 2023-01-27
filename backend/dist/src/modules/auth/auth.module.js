"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const user_module_1 = require("../user/user.module");
const local_strategy_1 = require("./local.strategy");
const jwt_1 = require("@nestjs/jwt");
const api_config_service_1 = require("../../shared/services/api-config.service");
const shared_module_1 = require("../../shared/shared.module");
const jwt_strategy_1 = require("./jwt.strategy");
const session_module_1 = require("../session/session.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => session_module_1.SessionModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            passport_1.PassportModule.register({
                session: false,
            }),
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    secret: configService.authConfig.publicKey,
                    verifyOptions: {
                        algorithms: ['RS256'],
                    },
                    signOptions: {
                        expiresIn: configService.authConfig.jwtExpirationTime,
                    },
                }),
                inject: [api_config_service_1.ApiConfigService],
            }),
            shared_module_1.SharedModule,
        ],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, api_config_service_1.ApiConfigService],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map