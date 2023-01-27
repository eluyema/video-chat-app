import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private apiConfigService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.authConfig.publicKey,
    });
  }

  private static extractJWT(req: Request): string | null {
    const token = req?.cookies['auth-token'];
    if (!token) {
      return null;
    }
    return token;
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
