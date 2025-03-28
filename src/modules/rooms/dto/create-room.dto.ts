import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { RoomStatus } from '../enums/room-status.enum';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  price: number;

  @IsEnum(RoomStatus)
  status: RoomStatus;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  floor?: number;

  @IsNumber()
  @IsOptional()
  area?: number;
} 