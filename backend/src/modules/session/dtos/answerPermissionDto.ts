import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AnswerPermissionDto {
  @IsString()
  shareId: string;

  @IsString()
  identity: string;

  @IsString()
  socketId: string;

  @IsBoolean()
  approved: boolean;
}
