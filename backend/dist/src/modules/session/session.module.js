"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_twilio_1 = require("nestjs-twilio");
const api_config_service_1 = require("../../shared/services/api-config.service");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/auth.service");
const user_module_1 = require("../user/user.module");
const session_controller_1 = require("./session.controller");
const session_enity_1 = require("./session.enity");
const session_gateway_1 = require("./session.gateway");
const session_service_1 = require("./session.service");
let SessionModule = class SessionModule {
};
SessionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            typeorm_1.TypeOrmModule.forFeature([session_enity_1.default]),
            nestjs_twilio_1.TwilioModule.forRootAsync({
                useFactory: (cfg) => cfg.twilioConfig,
                inject: [api_config_service_1.ApiConfigService],
            }),
        ],
        providers: [
            session_enity_1.default,
            session_service_1.SessionService,
            session_gateway_1.SessionGateway,
            api_config_service_1.ApiConfigService,
            auth_service_1.AuthService,
            jwt_1.JwtService,
        ],
        controllers: [session_controller_1.SessionController],
        exports: [session_enity_1.default, session_service_1.SessionService],
    })
], SessionModule);
exports.SessionModule = SessionModule;
//# sourceMappingURL=session.module.js.map