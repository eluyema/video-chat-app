import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { JwtStrategy } from './jwt.strategy';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    forwardRef(() => SessionModule),
    forwardRef(() => UserModule),
    PassportModule.register({
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.publicKey,
        verifyOptions: {
          algorithms: ['RS256'],
        },
        signOptions: {
          expiresIn: configService.authConfig.jwtExpirationTime,
        },
      }),
      inject: [ApiConfigService],
    }),
    SharedModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ApiConfigService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
