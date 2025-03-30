import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RoomStatus } from '../enums/room-status.enum';
import { RoomType } from '../../settings/entities/room-type.entity';

@Entity()
export class Room extends BaseEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  name: string;

  @ManyToOne(() => RoomType)
  roomType: RoomType;

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

  @Property({ type: 'array', nullable: true })
  images?: string[];

  @Property({ type: 'array', nullable: true })
  videos?: string[];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 