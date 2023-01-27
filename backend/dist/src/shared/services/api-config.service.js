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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const lodash_1 = require("lodash");
const session_enity_1 = require("../../modules/session/session.enity");
const user_enity_1 = require("../../modules/user/user.enity");
const snake_naming_strategy_1 = require("../../snake-naming.strategy");
let ApiConfigService = class ApiConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    get isDevelopment() {
        return this.nodeEnv === 'development';
    }
    get isProduction() {
        return this.nodeEnv === 'production';
    }
    get isTest() {
        return this.nodeEnv === 'test';
    }
    get authConfig() {
        return {
            publicKey: this.getString('JWT_PUBLIC_KEY'),
            jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
        };
    }
    get twilioAccessTokenConfig() {
        return [
            this.getString('TWILIO_ACCOUNT_SID'),
            this.getString('TWILIO_API_KEY_SID'),
            this.getString('TWILIO_API_KEY_SECRET'),
        ];
    }
    getNumber(key) {
        const value = this.get(key);
        try {
            return Number(value);
        }
        catch (_a) {
            throw new Error(key + ' environment variable is not a number');
        }
    }
    getBoolean(key) {
        const value = this.get(key);
        try {
            return Boolean(JSON.parse(value));
        }
        catch (_a) {
            throw new Error(key + ' env var is not a boolean');
        }
    }
    getString(key) {
        const value = this.get(key);
        return value.replace(/\\n/g, '\n');
    }
    get nodeEnv() {
        return this.getString('NODE_ENV');
    }
    get twilioConfig() {
        return {
            accountSid: this.getString('TWILIO_API_KEY_SID'),
            authToken: this.getString('TWILIO_API_KEY_SECRET'),
            options: {
                accountSid: this.getString('TWILIO_ACCOUNT_SID'),
            },
        };
    }
    get postgresConfig() {
        const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];
        return {
            entities: [user_enity_1.default, session_enity_1.default],
            migrations,
            keepConnectionAlive: !this.isTest,
            dropSchema: this.isTest,
            type: 'postgres',
            name: 'default',
            host: this.getString('DB_HOST'),
            port: this.getNumber('DB_PORT'),
            username: this.getString('DB_USERNAME'),
            password: this.getString('DB_PASSWORD'),
            database: this.getString('DB_DATABASE'),
            subscribers: [],
            migrationsRun: true,
            namingStrategy: new snake_naming_strategy_1.SnakeNamingStrategy(),
            logging: this.getBoolean('ENABLE_ORM_LOGS'),
        };
    }
    get(key) {
        const value = this.configService.get(key);
        if ((0, lodash_1.isNil)(value)) {
            throw new Error(key + ' environment variable does not set');
        }
        return value;
    }
};
ApiConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ApiConfigService);
exports.ApiConfigService = ApiConfigService;
//# sourceMappingURL=api-config.service.js.map