import { IsString, IsNumber, IsDateString, IsNotEmpty, IsUUID, IsArray, Min, IsOptional } from 'class-validator';
import { ContractStatus } from '../enums/contract-status.enum';

export class CreateContractDto {
  @IsUUID()
  @IsNotEmpty()
  tenantId!: string;

  @IsUUID()
  @IsNotEmpty()
  roomId!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsNumber()
  @Min(0)
  deposit!: number;

  @IsNumber()
  @Min(0)
  monthlyRent!: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  terms!: string[];

  @IsOptional()
  status?: ContractStatus;
} 