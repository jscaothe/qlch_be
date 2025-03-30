import { IsString, IsOptional } from 'class-validator';

export class UpdateRoomTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
} 