import { Entity, Property, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class RoomType extends BaseEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 