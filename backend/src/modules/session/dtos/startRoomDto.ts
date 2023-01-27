import { IsString } from 'class-validator';

export class StartRoomDto {
  @IsString()
  shareId: string;
}
