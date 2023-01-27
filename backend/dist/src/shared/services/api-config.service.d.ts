import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare class ApiConfigService {
    private configService;
    constructor(configService: ConfigService);
    get isDevelopment(): boolean;
    get isProduction(): boolean;
    get isTest(): boolean;
    get authConfig(): {
        publicKey: string;
        jwtExpirationTime: number;
    };
    get twilioAccessTokenConfig(): [string, string, string];
    private getNumber;
    private getBoolean;
    private getString;
    get nodeEnv(): string;
    get twilioConfig(): {
        accountSid: string;
        authToken: string;
        options: {
            accountSid: string;
        };
    };
    get postgresConfig(): TypeOrmModuleOptions;
    private get;
}
