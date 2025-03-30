import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsVietnamesePhoneNumber } from '../../../common/validators/phone.validator';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class User {
  @PrimaryKey()
  @ApiProperty()
  id!: number;

  @Property()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @Property({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @Property()
  @IsVietnamesePhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  phone!: string;

  @Enum(() => UserRole)
  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @Enum(() => UserStatus)
  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;

  @Property({ nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  password?: string;

  @Property()
  @ApiProperty()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @ApiProperty()
  updatedAt: Date = new Date();
} 