import { Strategy } from 'passport-jwt';
import { ApiConfigService } from 'src/shared/services/api-config.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private apiConfigService;
    constructor(apiConfigService: ApiConfigService);
    private static extractJWT;
    validate(payload: any): Promise<{
        userId: any;
        email: any;
    }>;
}
export {};
