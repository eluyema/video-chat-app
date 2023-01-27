import {
  Controller,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { Request, Res, UseGuards } from '@nestjs/common/decorators';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dtos/UserRegisterDto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.createUser(userRegisterDto);
    this.authService.addAuthCookies(res, user);
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    this.authService.addAuthCookies(res, req.user);
    return req.user;
  }

  @Post('/logout')
  async logout(@Request() req, @Res() res: Response) {
    this.authService.clearAuthCookies(res);
    res.status(HttpStatus.OK).json();
  }
}
