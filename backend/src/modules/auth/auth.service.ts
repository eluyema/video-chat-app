import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../user/user.enity';
import { Response } from 'express';
import { forwardRef } from '@nestjs/common/utils';
import { Inject } from '@nestjs/common/decorators';
import { ApiConfigService } from 'src/shared/services/api-config.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private jwtService: JwtService,
    private apiConfigService: ApiConfigService,
  ) {}

  async verifyPassword(hashedPassword: string, plainTextPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    return isPasswordMatching;
  }

  public async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.userService.findOne(email);
      const plainTextPassword = user.password;

      const verified = await this.verifyPassword(
        plainTextPassword,
        hashedPassword,
      );

      if (!verified) {
        return null;
      }

      user.password = undefined;
      return user;
    } catch (e) {
      return null;
    }
  }

  getDecodedToken(token: string | undefined) {
    const decoded = this.jwtService.verify(token, {
      secret: this.apiConfigService.authConfig.publicKey,
    });
    return decoded;
  }

  async addAuthCookies(res: Response, user: UserEntity) {
    const payload = { email: user.email, sub: user.id };
    const jwtToken = this.jwtService.sign(payload);

    res.cookie('auth-token', jwtToken, { httpOnly: true });
  }

  async clearAuthCookies(res: Response) {
    res.clearCookie('auth-token');
  }
}
