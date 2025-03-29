import { IsString, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { MaintenanceType, MaintenancePriority } from '../entities/maintenance.entity';

export class CreateMaintenanceDto {
  @IsString()
  @IsNotEmpty()
  equipmentId!: string;

  @IsString()
  @IsNotEmpty()
  equipmentName!: string;

  @IsEnum(MaintenanceType)
  maintenanceType!: MaintenanceType;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  startDate!: string;

  @IsEnum(MaintenancePriority)
  priority!: MaintenancePriority;

  @IsString()
  @IsNotEmpty()
  assignedTo!: string;
} 