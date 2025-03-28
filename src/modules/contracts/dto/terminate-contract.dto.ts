import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class TerminateContractDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @IsDateString()
  @IsNotEmpty()
  terminationDate!: string;
} 