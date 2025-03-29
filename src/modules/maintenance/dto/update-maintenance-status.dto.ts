import { IsEnum, IsString, IsOptional } from 'class-validator';
import { MaintenanceStatus } from '../entities/maintenance.entity';

export class UpdateMaintenanceStatusDto {
  @IsEnum(MaintenanceStatus)
  status!: MaintenanceStatus;

  @IsString()
  @IsOptional()
  notes?: string;
} 