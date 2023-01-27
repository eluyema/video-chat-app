import UpdateMyUserDto from './dtos/updateMyUserDto';
import { UserService } from './user.service';
import { PublicUser } from './user.types';
import { Response } from 'express';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<PublicUser>;
    updateMyProfile(req: any, dto: UpdateMyUserDto, res: Response): Promise<PublicUser>;
}
