import { Migration } from '@mikro-orm/migrations';

export class Migration20250329063929 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" alter column "phone" type varchar(255) using ("phone"::varchar(255));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" alter column "phone" type int using ("phone"::int);`);
  }

}
