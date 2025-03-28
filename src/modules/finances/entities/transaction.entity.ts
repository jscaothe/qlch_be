import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { TransactionType } from '../enums/transaction-type.enum';

@Entity()
export class Transaction extends BaseEntity {
  @Property()
  type!: TransactionType;

  @Property()
  amount!: number;

  @Property()
  category!: string;

  @Property()
  description?: string;

  @Property()
  date!: Date;

  @ManyToOne(() => Room, { nullable: true })
  room?: Room;

  @ManyToOne(() => Tenant, { nullable: true })
  tenant?: Tenant;
} 