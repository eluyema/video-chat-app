import { Controller, Post, Get, Delete } from '@nestjs/common';
import {
  Body,
  Request,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PublicUser } from '../user/user.types';
import { AddApprovedUserDto } from './dtos/addApprovedUserDto';
import { CreateSessionDto } from './dtos/createSessionDto';
import { RoomEventsDto } from './dtos/roomEventsDto';
import { UpdateSessionDto } from './dtos/updateSessionDto';
import { SessionService } from './session.service';
import { PublicSession } from './session.types';

@Controller('sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createSession(@Request() req, @Body() dto: CreateSessionDto) {
    const { email } = req.user;
    return this.sessionService.createSession(dto, email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getMySessions(@Request() req): Promise<PublicSession[]> {
    const { email } = req.user;
    return this.sessionService.getAllSessionByUser(email);
  }

  @Get('/:shareId')
  async getSessionInfo(@Param('shareId') shareId): Promise<PublicSession> {
    return this.sessionService.getSessionInfo(shareId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:shareId')
  async removeSession(
    @Request() req,
    @Param('shareId') shareId,
  ): Promise<string> {
    const { email } = req.user;
    await this.sessionService.removeMySession(shareId, email);
    return shareId;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:shareId')
  async updateSession(
    @Request() req,
    @Param('shareId') shareId,
    @Body() dto: UpdateSessionDto,
  ): Promise<PublicSession> {
    const { email } = req.user;
    return this.sessionService.updateMySession(shareId, email, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/stop/:shareId')
  async stopSession(@Request() req, @Param('shareId') shareId): Promise<void> {
    const { email } = req.user;
    return this.sessionService.stopMySession(email, shareId);
  }

  @Post('/room-events')
  async roomEvents(@Body() dto: RoomEventsDto): Promise<void> {
    return this.sessionService.onRoomEvent(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:shareId/approved-users')
  async addApprovedUser(
    @Request() req,
    @Param('shareId') shareId,
    @Param('email') email,
  ): Promise<PublicUser> {
    const { email: myEmail } = req.user;
    return this.sessionService.addApprovedUser(myEmail, shareId, email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:shareId/approved-users')
  async GetApprovedUsers(
    @Request() req,
    @Param('shareId') shareId,
  ): Promise<PublicUser[]> {
    const { email } = req.user;
    return this.sessionService.getAllApprovedUsers(email, shareId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:shareId/approved-users/:email')
  async deleteApprovedUser(
    @Request() req,
    @Param('shareId') shareId,
    @Param('email') email,
  ): Promise<PublicUser> {
    const { email: myEmail } = req.user;
    return this.sessionService.deleteApprovedUser(myEmail, shareId, email);
  }
}
