import { IsOptional, IsString } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  shareId: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
