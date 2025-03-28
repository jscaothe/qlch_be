import { Entity, Property, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RoomStatus } from '../enums/room-status.enum';

@Entity()
export class Room extends BaseEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  name: string;

  @Property()
  type: string;

  @Property({ nullable: true })
  floor?: number;

  @Property({ nullable: true })
  area?: number;

  @Property()
  price: number;

  @Property()
  status: RoomStatus;

  @Property({ nullable: true })
  description?: string;

  @Property({ type: 'array', nullable: true })
  amenities?: string[];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 