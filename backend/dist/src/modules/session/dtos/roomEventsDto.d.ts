import { TwilioRoomStatusEnum } from '../session.types';
export declare class RoomEventsDto {
    RoomStatus: TwilioRoomStatusEnum;
    RoomType: string;
    RoomSid: string;
    RoomName: string;
    ParticipantDuration: string;
    ParticipantStatus: string;
    ParticipantIdentity: string;
    SequenceNumber: string;
    StatusCallbackEvent: string;
    Timestamp: string;
    ParticipantSid: string;
    AccountSid: string;
}
