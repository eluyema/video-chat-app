import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import UserEntity from './user.enity';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
