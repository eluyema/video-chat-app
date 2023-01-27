import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../user/user.enity';
import { Response } from 'express';
import { ApiConfigService } from 'src/shared/services/api-config.service';
export declare class AuthService {
    private readonly userService;
    private jwtService;
    private apiConfigService;
    constructor(userService: UserService, jwtService: JwtService, apiConfigService: ApiConfigService);
    verifyPassword(hashedPassword: string, plainTextPassword: string): Promise<boolean>;
    getAuthenticatedUser(email: string, hashedPassword: string): Promise<UserEntity>;
    getDecodedToken(token: string | undefined): any;
    addAuthCookies(res: Response, user: UserEntity): Promise<void>;
    clearAuthCookies(res: Response): Promise<void>;
}
