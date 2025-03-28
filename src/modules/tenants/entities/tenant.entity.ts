import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Room } from '../../rooms/entities/room.entity';

export enum TenantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class Tenant extends BaseEntity {
  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  phone: string;

  @Property({ nullable: true })
  identityCard?: string;

  @Property({ nullable: true })
  dateOfBirth?: Date;

  @Property({ nullable: true })
  address?: string;

  @Property({ nullable: true })
  startDate?: Date;

  @Property({ nullable: true })
  endDate?: Date;

  @ManyToOne(() => Room, { nullable: true })
  room?: Room;

  @Property({ nullable: true })
  avatar?: string;

  @Property()
  status: TenantStatus = TenantStatus.ACTIVE;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 