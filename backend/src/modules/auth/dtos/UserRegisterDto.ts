import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  NotContains,
} from 'class-validator';

import { Trim } from '../../../decorators/transform.decorators';

export class UserRegisterDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @Trim()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @NotContains(' ', { message: "Password shouldn't contain spaces" })
  @MinLength(6)
  readonly password: string;
}
