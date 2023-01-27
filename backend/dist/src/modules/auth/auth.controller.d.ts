import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dtos/UserRegisterDto';
export declare class AuthController {
    private userService;
    private authService;
    constructor(userService: UserService, authService: AuthService);
    userRegister(userRegisterDto: UserRegisterDto, res: Response): Promise<import("../user/user.enity").default>;
    login(req: any, res: Response): Promise<any>;
    logout(req: any, res: Response): Promise<void>;
}
