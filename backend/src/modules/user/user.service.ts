import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from '../auth/dtos/UserRegisterDto';
import UserEntity from './user.enity';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import SessionEntity from '../session/session.enity';
import { PublicSession } from '../session/session.types';
import { getPublicSession } from 'src/utils/mapers/sessions';
import { PublicUser } from './user.types';
import { getPublicUser } from 'src/utils/mapers/users';
import UpdateMyUserDto from './dtos/updateMyUserDto';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';
import { forwardRef } from '@nestjs/common/utils';
import { Inject } from '@nestjs/common/decorators';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const existedUser = await this.findOne(userRegisterDto.email);

    if (existedUser) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `User with email "${userRegisterDto.email}" already was registered`,
        },
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await bcrypt.hash(userRegisterDto.password, 10);
    try {
      const user = this.userRepository.create({
        ...userRegisterDto,
        password: passwordHash,
      });

      await this.userRepository.save(user);
      user.password = undefined;
      return user;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllSessions(email: string): Promise<PublicSession[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: {
          createdSessions: true,
        },
      });
      const preparedSessions: PublicSession[] = user.createdSessions.map(
        (session) =>
          getPublicSession({ ...session, author: user } as SessionEntity),
      );
      return preparedSessions;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMyUser(
    res: Response,
    email: string,
    dto: UpdateMyUserDto,
  ): Promise<PublicUser> {
    if (dto.email) {
      const user = await this.findOne(dto.email);
      if (user) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `User with email "${dto.email}" already was registered`,
          },
          HttpStatus.CONFLICT,
        );
      }
    }
    const preparedDto = { ...dto };
    if (dto.password) {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      preparedDto.password = passwordHash;
    }
    try {
      await this.userRepository.update({ email }, preparedDto);
      if (dto.email) {
        const updatedUser = await this.findOne(dto.email);
        await this.authService.addAuthCookies(res, updatedUser);
        return getPublicUser(updatedUser);
      }
      return await this.findPublicUser(email);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(email: string): Promise<UserEntity | undefined> {
    try {
      return this.userRepository.findOneBy({ email });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findPublicUser(email: string): Promise<PublicUser | undefined> {
    return getPublicUser(await this.findOne(email));
  }
}
