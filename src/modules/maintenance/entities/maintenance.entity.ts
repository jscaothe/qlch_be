import { Entity, Property, Enum } from '@mikro-orm/core';

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  PREDICTIVE = 'predictive',
}

export enum MaintenanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity()
export class Maintenance {
  @Property({ primary: true })
  id!: string;

  @Property()
  equipmentId!: string;

  @Property()
  equipmentName!: string;

  @Enum(() => MaintenanceType)
  maintenanceType!: MaintenanceType;

  @Property()
  description!: string;

  @Property()
  startDate!: Date;

  @Enum(() => MaintenancePriority)
  priority!: MaintenancePriority;

  @Property()
  assignedTo!: string;

  @Enum(() => MaintenanceStatus)
  status: MaintenanceStatus = MaintenanceStatus.PENDING;

  @Property({ nullable: true })
  notes?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 