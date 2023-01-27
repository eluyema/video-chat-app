import { Controller, Get, Put } from '@nestjs/common';
import { Request, UseGuards, Body, Res } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import UpdateMyUserDto from './dtos/updateMyUserDto';
import { UserService } from './user.service';
import { PublicUser } from './user.types';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req): Promise<PublicUser> {
    return this.userService.findPublicUser(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/my')
  updateMyProfile(
    @Request() req,
    @Body() dto: UpdateMyUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PublicUser> {
    return this.userService.updateMyUser(res, req.user.email, dto);
  }
}
