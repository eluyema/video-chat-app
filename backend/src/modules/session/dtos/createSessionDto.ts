import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { SessionSecurity } from '../session.enity';

export class CreateSessionDto {
  @IsBoolean()
  readonly reusable: boolean;

  @IsString()
  @MinLength(4)
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsDateString()
  @IsOptional()
  readonly plannedDate: Date;

  @IsEnum(SessionSecurity)
  readonly security: SessionSecurity;

  @IsString()
  @MinLength(5)
  @IsOptional()
  readonly password: string;
}
