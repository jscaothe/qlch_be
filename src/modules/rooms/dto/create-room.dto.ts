import { IsString, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { RoomStatus } from '../enums/room-status.enum';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  roomTypeId: string;

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videos?: string[];
} 