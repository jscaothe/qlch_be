import { IsString, IsBoolean } from 'class-validator';

export class UpdatePreferencesDto {
  @IsString()
  language!: string;

  @IsBoolean()
  notifications!: boolean;

  @IsBoolean()
  emailNotifications!: boolean;

  @IsString()
  currency!: string;

  @IsString()
  timezone!: string;

  @IsString()
  dateFormat!: string;
} 