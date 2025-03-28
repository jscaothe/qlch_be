import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  buildingInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };

  @Column('json')
  userPreferences: {
    language: string;
    notifications: boolean;
    emailNotifications: boolean;
    currency: string;
    timezone: string;
    dateFormat: string;
  };

  @Column('json')
  categories: {
    income: string[];
    expense: string[];
  };
} 