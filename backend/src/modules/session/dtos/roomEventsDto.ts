import { IsOptional, IsString } from 'class-validator';
import { TwilioRoomStatusEnum } from '../session.types';

export class RoomEventsDto {
  @IsOptional()
  @IsString()
  RoomStatus: TwilioRoomStatusEnum;

  @IsOptional()
  @IsString()
  RoomType: string;

  @IsOptional()
  @IsString()
  RoomSid: string;

  @IsOptional()
  @IsString()
  RoomName: string;

  @IsOptional()
  @IsString()
  ParticipantDuration: string;

  @IsOptional()
  @IsString()
  ParticipantStatus: string;

  @IsOptional()
  @IsString()
  ParticipantIdentity: string;

  @IsOptional()
  @IsString()
  SequenceNumber: string;

  @IsOptional()
  @IsString()
  StatusCallbackEvent: string;

  @IsOptional()
  @IsString()
  Timestamp: string;

  @IsOptional()
  @IsString()
  ParticipantSid: string;

  @IsOptional()
  @IsString()
  AccountSid: string;
}
