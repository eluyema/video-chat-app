import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { TwilioModuleOptions } from 'nestjs-twilio';
import SessionEntity from 'src/modules/session/session.enity';
import UserEntity from 'src/modules/user/user.enity';

import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get authConfig() {
    return {
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get twilioAccessTokenConfig(): [string, string, string] {
    return [
      this.getString('TWILIO_ACCOUNT_SID'),
      this.getString('TWILIO_API_KEY_SID'),
      this.getString('TWILIO_API_KEY_SECRET'),
    ];
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get twilioConfig() {
    return {
      accountSid: this.getString('TWILIO_API_KEY_SID'),
      authToken: this.getString('TWILIO_API_KEY_SECRET'),
      options: {
        accountSid: this.getString('TWILIO_ACCOUNT_SID'),
      },
    };
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];
    return {
      entities: [UserEntity, SessionEntity],
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      subscribers: [],
      migrationsRun: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);
    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
