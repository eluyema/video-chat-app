import { IsString } from 'class-validator';

export class DeclineAskingPermissionDto {
  @IsString()
  shareId: string;
}
