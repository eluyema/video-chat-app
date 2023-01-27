import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioModule } from 'nestjs-twilio';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UserModule } from '../user/user.module';
import { SessionController } from './session.controller';
import SessionEntity from './session.enity';
import { SessionGateway } from './session.gateway';
import { SessionService } from './session.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([SessionEntity]),
    TwilioModule.forRootAsync({
      useFactory: (cfg: ApiConfigService) => cfg.twilioConfig,
      inject: [ApiConfigService],
    }),
  ],
  providers: [
    SessionEntity,
    SessionService,
    SessionGateway,
    ApiConfigService,
    AuthService,
    JwtService,
  ],
  controllers: [SessionController],
  exports: [SessionEntity, SessionService],
})
export class SessionModule {}
