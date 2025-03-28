import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 