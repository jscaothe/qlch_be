import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  name!: string;

  @Property({ unique: true })
  @ApiProperty()
  email!: string;

  @Property()
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
  password?: string;

  @Property()
  @ApiProperty()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @ApiProperty()
  updatedAt: Date = new Date();
} 