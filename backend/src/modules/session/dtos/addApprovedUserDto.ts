import { IsString } from 'class-validator';

export class AddApprovedUserDto {
  @IsString()
  email: string;
}
