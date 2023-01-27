import { IsString } from 'class-validator';

export class SendMessageToRoomDto {
  @IsString()
  shareId: string;

  @IsString()
  displayName: string;

  @IsString()
  message: string;
}
