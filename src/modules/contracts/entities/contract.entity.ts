import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Room } from '../../rooms/entities/room.entity';
import { ContractStatus } from '../enums/contract-status.enum';

@Entity()
export class Contract {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => Tenant)
  tenant!: Tenant;

  @ManyToOne(() => Room)
  room!: Room;

  @Property()
  startDate!: Date;

  @Property()
  endDate!: Date;

  @Property()
  deposit!: number;

  @Property()
  monthlyRent!: number;

  @Property({ type: 'array' })
  terms!: string[];

  @Property()
  status: ContractStatus = ContractStatus.ACTIVE;

  @Property({ nullable: true })
  terminationReason?: string;

  @Property({ nullable: true })
  terminationDate?: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 