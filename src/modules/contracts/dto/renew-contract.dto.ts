import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class RenewContractDto {
  @IsDateString()
  newEndDate!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  newMonthlyRent?: number;
} 