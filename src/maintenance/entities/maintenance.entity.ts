import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  equipmentId: string;

  @Column()
  equipmentName: string;

  @Column()
  maintenanceType: 'preventive' | 'corrective' | 'predictive';

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  priority: 'low' | 'medium' | 'high';

  @Column()
  assignedTo: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 