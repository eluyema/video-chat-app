import { Repository } from 'typeorm';
import { UserRegisterDto } from '../auth/dtos/UserRegisterDto';
import UserEntity from './user.enity';
import { PublicSession } from '../session/session.types';
import { PublicUser } from './user.types';
import UpdateMyUserDto from './dtos/updateMyUserDto';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';
export declare class UserService {
    private userRepository;
    private authService;
    constructor(userRepository: Repository<UserEntity>, authService: AuthService);
    createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity>;
    getAllSessions(email: string): Promise<PublicSession[]>;
    updateMyUser(res: Response, email: string, dto: UpdateMyUserDto): Promise<PublicUser>;
    findOne(email: string): Promise<UserEntity | undefined>;
    findPublicUser(email: string): Promise<PublicUser | undefined>;
}
