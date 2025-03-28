import { IsString, IsEnum, IsDate, IsNotEmpty } from 'class-validator';

export class CreateMaintenanceDto {
  @IsString()
  @IsNotEmpty()
  equipmentId: string;

  @IsString()
  @IsNotEmpty()
  equipmentName: string;

  @IsEnum(['preventive', 'corrective', 'predictive'])
  maintenanceType: 'preventive' | 'corrective' | 'predictive';

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  startDate: Date;

  @IsEnum(['low', 'medium', 'high'])
  priority: 'low' | 'medium' | 'high';

  @IsString()
  @IsNotEmpty()
  assignedTo: string;
} 