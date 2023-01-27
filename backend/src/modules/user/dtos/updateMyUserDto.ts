import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  NotContains,
  IsOptional,
} from 'class-validator';
import { Trim } from '../../../decorators/transform.decorators';

class UpdateMyUserDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly lastName: string;

  @Trim()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  readonly email: string;

  @IsString()
  @NotContains(' ', { message: "Password shouldn't contain spaces" })
  @MinLength(6)
  @IsOptional()
  readonly password: string;
}

export default UpdateMyUserDto;
