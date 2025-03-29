import { Entity, Property } from '@mikro-orm/core';

@Entity()
export class Settings {
  @Property({ primary: true })
  id!: string;

  // Building Info
  @Property()
  buildingName!: string;

  @Property()
  buildingAddress!: string;

  @Property()
  buildingPhone!: string;

  @Property()
  buildingEmail!: string;

  // User Preferences
  @Property()
  language: string = 'vi';

  @Property()
  notifications: boolean = true;

  @Property()
  emailNotifications: boolean = true;

  @Property()
  currency: string = 'VND';

  @Property()
  timezone: string = 'Asia/Ho_Chi_Minh';

  @Property()
  dateFormat: string = 'DD/MM/YYYY';

  // Categories
  @Property({ type: 'json' })
  incomeCategories: string[] = ['Tiền thuê phòng', 'Tiền cọc', 'Khác'];

  @Property({ type: 'json' })
  expenseCategories: string[] = ['Điện', 'Nước', 'Internet', 'Bảo trì', 'Khác'];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 