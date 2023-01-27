import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(18)
  readonly password: string;
}
