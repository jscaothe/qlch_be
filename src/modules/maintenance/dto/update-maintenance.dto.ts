import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateMaintenanceDto {
  @IsEnum(['pending', 'in_progress', 'completed', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @IsString()
  @IsOptional()
  notes?: string;
} 