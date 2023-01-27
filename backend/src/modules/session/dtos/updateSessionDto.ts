import {
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { SessionSecurity } from '../session.enity';

export class UpdateSessionDto {
  @IsString()
  @MinLength(4)
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsDateString()
  @IsOptional()
  readonly plannedDate: Date;

  @IsEnum(SessionSecurity)
  @IsOptional()
  readonly security: SessionSecurity;

  @IsString()
  @MinLength(5)
  @IsOptional()
  readonly password: string;
}
