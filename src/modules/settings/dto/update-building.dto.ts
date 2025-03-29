import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateBuildingDto {
  @IsString()
  @IsNotEmpty()
  buildingName!: string;

  @IsString()
  @IsNotEmpty()
  buildingAddress!: string;

  @IsString()
  @IsNotEmpty()
  buildingPhone!: string;

  @IsEmail()
  @IsNotEmpty()
  buildingEmail!: string;
} 