import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserPreferencesDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsBoolean()
  notifications: boolean;

  @IsBoolean()
  emailNotifications: boolean;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  timezone: string;

  @IsString()
  @IsNotEmpty()
  dateFormat: string;
} 