import { IsArray, IsString } from 'class-validator';

export class UpdateCategoriesDto {
  @IsArray()
  @IsString({ each: true })
  income: string[];

  @IsArray()
  @IsString({ each: true })
  expense: string[];
} 