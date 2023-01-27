import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import SessionEntity, { SessionSecurity } from './session.enity';
import { CreateSessionDto } from './dtos/createSessionDto';
import * as shortid from 'shortid';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { PublicSession, TwilioRoomStatusEnum } from './session.types';
import { getPublicSession } from 'src/utils/mapers/sessions';
import { TwilioService } from 'nestjs-twilio';
import { jwt } from 'twilio';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { v4 as uuidv4 } from 'uuid';
import { JoinRoomDto } from './dtos/joinRoomDto';
import { UpdateSessionDto } from './dtos/updateSessionDto';
import { AuthService } from '../auth/auth.service';
import { forwardRef } from '@nestjs/common/utils';
import { Inject } from '@nestjs/common/decorators';
import { StartRoomDto } from './dtos/startRoomDto';
import * as bcrypt from 'bcrypt';
import { RoomEventsDto } from './dtos/roomEventsDto';
import { Server, Socket } from 'socket.io';

import { AnswerPermissionDto } from './dtos/answerPermissionDto';
import { DeclineAskingPermissionDto } from './dtos/declineAskingPermissionDto';
import { SendMessageToRoomDto } from './dtos/sendMessageToRoomDto';
import { AddApprovedUserDto } from './dtos/addApprovedUserDto';
import { getPublicUser } from 'src/utils/mapers/users';

const AccessToken = jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    private readonly userService: UserService,
    private readonly twilioService: TwilioService,
    private readonly appConfigService: ApiConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createSession(sessionDto: CreateSessionDto, email: string) {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: 'User do not exist',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const shareId = await this.getUniqueShortId(10);

    const sessionValues = {
      ...sessionDto,
      shareId,
      isRanning: false,
    };

    if (
      !sessionDto.password &&
      sessionDto.security === SessionSecurity.PASSWORD
    ) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (sessionDto.password) {
      sessionValues.password = await bcrypt.hash(sessionDto.password, 10);
    }

    const session = this.sessionRepository.create({
      ...sessionValues,
    });
    session.author = user;
    await this.sessionRepository.save(session);
    const createdSession = await this.sessionRepository.findOne({
      relations: {
        author: true,
      },
      where: {
        shareId,
      },
    });
    return getPublicSession(createdSession);
  }

  async getAllSessionByUser(email: string): Promise<PublicSession[]> {
    const sessions = await this.userService.getAllSessions(email);
    return sessions;
  }

  async updateMySession(
    myShareId: string,
    email: string,
    dto: UpdateSessionDto,
  ): Promise<PublicSession> {
    const sessions = await this.userService.getAllSessions(email);
    const isSessionExist = sessions.some(
      ({ shareId }) => myShareId === shareId,
    );
    if (!isSessionExist) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Session not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!dto.password && dto.security === SessionSecurity.PASSWORD) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    let password = undefined;
    if (dto.password && dto.security === SessionSecurity.PASSWORD) {
      password = await bcrypt.hash(dto.password, 10);
    }

    try {
      await this.sessionRepository.update(
        { shareId: myShareId },
        { ...dto, password },
      );
      return getPublicSession(
        await this.sessionRepository.findOne({
          relations: {
            author: true,
          },
          where: {
            shareId: myShareId,
          },
        }),
      );
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

  async removeMySession(myShareId: string, email: string): Promise<void> {
    const sessions = await this.userService.getAllSessions(email);
    const session = sessions.find(({ shareId }) => myShareId === shareId);
    if (!session) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Session not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      try {
        await this.stopMySession(email, myShareId);
      } catch {}
      await this.sessionRepository.delete({ shareId: myShareId });
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

  async addApprovedUser(myEmail: string, shareId: string, userEmail: string) {
    try {
      const session = await this.sessionRepository.findOne({
        relations: {
          author: true,
          approvedParticipants: true,
        },
        where: {
          shareId,
        },
      });
      if (session.author.email !== myEmail) {
        throw new Error();
      }
      const user = await this.userService.findOne(userEmail);
      session.approvedParticipants.push(user);
      await this.sessionRepository.save(session);
      return getPublicUser(user);
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

  async getAllApprovedUsers(myEmail, shareId) {
    try {
      const session = await this.sessionRepository.findOne({
        relations: {
          author: true,
          approvedParticipants: true,
        },
        where: {
          shareId,
        },
      });
      if (session.author.email !== myEmail) {
        throw new Error();
      }
      return session.approvedParticipants.map((user) => getPublicUser(user));
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

  async deleteApprovedUser(myEmail, shareId, userEmail) {
    try {
      const session = await this.sessionRepository.findOne({
        relations: {
          author: true,
          approvedParticipants: true,
        },
        where: {
          shareId,
        },
      });
      if (session.author.email !== myEmail) {
        throw new Error();
      }
      const user = await this.userService.findOne(userEmail);
      if (!user) {
        throw new Error();
      }
      const isSessionContain = session.approvedParticipants.some(
        ({ email }) => email === userEmail,
      );
      if (!isSessionContain) {
        throw new Error();
      }
      session.approvedParticipants = session.approvedParticipants.filter(
        ({ email }) => email !== userEmail,
      );
      await this.sessionRepository.save(session);
      return getPublicUser(user);
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

  async getSessionInfo(shareId: string): Promise<PublicSession> {
    try {
      const session = await this.sessionRepository.findOne({
        relations: {
          author: true,
        },
        where: {
          shareId,
        },
      });
      const publicSession = getPublicSession(session);
      return publicSession;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Session not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUniqueShortId(maxTryCount): Promise<string> {
    for (let tryCount = 0; tryCount < maxTryCount; tryCount++) {
      const shareId = shortid.generate();
      const existedSession = await this.sessionRepository.findOneBy({
        shareId,
      });
      if (!existedSession) {
        return shareId;
      }
    }
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Something went wrong',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  getTwilioAccessToken(roomName, identity) {
    const token = new AccessToken(
      ...this.appConfigService.twilioAccessTokenConfig,
      { identity },
    );
    const videoGrant = new VideoGrant({
      room: roomName,
    });
    token.addGrant(videoGrant);
    return { videoToken: token.toJwt(), roomName };
  }

  async findOrCreateRoom(roomName) {
    try {
      // see if the room exists already. If it doesn't, this will throw
      // error 20404.
      const room = await this.twilioService.client.video.rooms(roomName).fetch();
      return room;
    } catch (error) {
        return await this.twilioService.client.video.rooms.create({
          uniqueName: roomName,
          maxParticipantDuration: 3600,
          unusedRoomTimeout: 1,
          emptyRoomTimeout: 1,
          type: 'group',
        });
    }
  }

  async declineAskingPermission(
    socket: Socket,
    dto: DeclineAskingPermissionDto,
  ) {
    const { shareId } = dto;
    try {
      const session = await this.sessionRepository.findOneBy({ shareId });
      if (session && session.twilioRoomId) {
        socket
          .to(session.twilioRoomId)
          .emit('decline-asking-permission', { socketId: socket.id });
      }
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Session Not Found',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async answerPermission(
    io: Server,
    socket: Socket,
    token: string | undefined,
    dto: AnswerPermissionDto,
  ) {
    const session = await this.sessionRepository.findOne({
      where: {
        shareId: dto.shareId,
      },
      relations: {
        author: true,
      },
    });

    if (!token || !session || !session.isRanning) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const decoded = this.authService.getDecodedToken(token);
      const user = await this.userService.findOne(decoded.email);
      if (!user || user.email !== session.author.email) {
        throw new Error();
      }
      if (dto.approved) {
        const participantData = JSON.parse(dto.identity);
        const data = await this.joinCall(
          dto.shareId,
          participantData.displayName,
          participantData.email,
        );
        io.sockets.sockets.get(dto.socketId).join(data.roomName);
        socket.to(dto.socketId).emit('success-join', data);
      } else {
        socket.to(dto.socketId).emit('denied-join');
      }
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

  async startSession(token: string | undefined, dto: StartRoomDto) {
    const session = await this.sessionRepository.findOne({
      where: {
        shareId: dto.shareId,
      },
      relations: {
        author: true,
      },
    });

    if (!token || !session || session.isRanning) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const decoded = this.authService.getDecodedToken(token);
      const user = await this.userService.findOne(decoded.email);
      if (!user || user.email !== session.author.email) {
        throw new Error();
      }
      const displayName = `${user.firstName} ${user.lastName}`;
      return this.startCall(dto.shareId, displayName, user.email);
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

  async joinToSession(
    socket: Socket,
    token: string | undefined,
    dto: JoinRoomDto,
  ) {
    const session = await this.sessionRepository.findOne({
      where: {
        shareId: dto.shareId,
      },
      relations: {
        author: true,
      },
    });

    if (!session || !session.isRanning) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    let displayName = dto.displayName;
    let email = undefined;
    let registered = false;
    try {
      const decoded = this.authService.getDecodedToken(token);

      const user = await this.userService.findOne(decoded.email);
      if (user) {
        registered = true;
        displayName = `${user.firstName} ${user.lastName}`;
        email = user.email;
        if (session.author.email === user.email) {
          const data = await this.joinCall(dto.shareId, displayName, email);
          socket.join(data.roomName);
          return data;
        }
      }
    } catch (e) {
      if (!displayName) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Something went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    switch (session.security) {
      case SessionSecurity.NONE: {
        const data = await this.joinCall(dto.shareId, displayName, email);
        socket.join(data.roomName);
        return data;
      }
      case SessionSecurity.PASSWORD: {
        const verified = await this.authService.verifyPassword(
          session.password,
          dto.password,
        );
        if (!verified) {
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'Password is wrong',
            },
            HttpStatus.FORBIDDEN,
          );
        }
        const data = await this.joinCall(dto.shareId, displayName, email);
        socket.join(data.roomName);
        return data;
      }
      case SessionSecurity.REGISTRED: {
        if (!registered) {
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'Something went wrong',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        const data = await this.joinCall(dto.shareId, displayName, email);
        socket.join(data.roomName);
        return data;
      }
      case SessionSecurity.PERMISSION: {
        if (!session.twilioRoomId) {
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: `Room doesn't setted for session`,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        const identityData = { displayName, email };
        const identity = JSON.stringify(identityData);
        socket.to(session.twilioRoomId).emit('ask-permission', {
          socketId: socket.id,
          identity,
        });
        return { videoToken: '', roomName: session.twilioRoomId };
      }
      default: {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Something went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async onRoomEvent(dto: RoomEventsDto) {
    const isAuthorizated =
      this.appConfigService.twilioConfig.options.accountSid === dto.AccountSid;
    if (!isAuthorizated) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Not Authorizated',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (dto.RoomStatus === TwilioRoomStatusEnum.INPROGRESS) {
      return;
    }

    const session = await this.sessionRepository.findOneBy({
      twilioRoomId: dto.RoomName,
    });

    if (!session) {
      return;
    }
    if (!session.reusable) {
      await this.sessionRepository.delete({ shareId: session.shareId });
    } else {
      session.isRanning = false;
      session.twilioRoomId = null;
      await this.sessionRepository.save(session);
    }
  }

  async sendMessageToRoom(socket: Socket, dto: SendMessageToRoomDto) {
    try {
      const session = await this.sessionRepository.findOneBy({
        shareId: dto.shareId,
      });
      if (!session.twilioRoomId) {
        throw new Error();
      }
      if (socket.rooms.has(session.twilioRoomId)) {
        socket.to(session.twilioRoomId).emit('message-recieve', {
          displayName: dto.displayName,
          message: dto.message,
        });
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Session not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async stopMySession(email, shareId) {
    const session = await this.sessionRepository.findOne({
      where: {
        shareId: shareId,
      },
      relations: {
        author: true,
      },
    });
    if (!session) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Session not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (session.author.email !== email) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'This session is not your',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!session.isRanning || !session.twilioRoomId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'This session is not running',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.twilioService.client.video
      .rooms(session.twilioRoomId)
      .update({ status: 'completed' })
      .then((room) => console.log(room.uniqueName));
  }

  async joinCall(shareId: string, displayName: string, email?: string) {
    try {

      const session = await this.sessionRepository.findOneBy({ shareId });
      if (!session || !session.isRanning) {

        throw new Error();
      }

      const room = await this.findOrCreateRoom(session.twilioRoomId)
      const data = { displayName, email };
      const newIdentity = JSON.stringify(data);
      const connectedParticipants = await room.participants().list();
      const participant = connectedParticipants.find(
        ({ identity }) => identity === newIdentity,
      );
      if (participant) {
        if (email) {
          const deletedParticipant = await this.twilioService.client.video
            .rooms(session.twilioRoomId)
            .participants(participant.sid)
            .update({ status: 'disconnected' });
        } else {
          throw new Error('Identity already exist');
        }
      }
      return this.getTwilioAccessToken(session.twilioRoomId, newIdentity);
    } catch (e) {
      if (e instanceof Error && e.message === 'Identity already exist') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'This user already connected',
          },
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async startCall(shareId: string, displayName: string, email: string) {
    try {
      const session = await this.sessionRepository.findOneBy({ shareId });

      if (!session || session.isRanning) {
        throw new Error();
      }
      const twilioId = uuidv4();
      session.twilioRoomId = twilioId;
      session.isRanning = true;
      await this.sessionRepository.save(session);
      await this.findOrCreateRoom(twilioId);
      const data = { displayName, email };
      const identity = JSON.stringify(data);
      return this.getTwilioAccessToken(twilioId, identity);
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
}
