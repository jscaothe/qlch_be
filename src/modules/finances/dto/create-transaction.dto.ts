import { IsEnum, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsNumber()
  amount!: number;

  @IsString()
  category!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  tenantId?: string;
} 