import { Migration } from '@mikro-orm/migrations';

export class Migration20250330020104 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "room_type" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "room_type_pkey" primary key ("id"));`);

    this.addSql(`alter table "room" drop column "type";`);

    this.addSql(`alter table "room" add column "room_type_id" varchar(255) not null;`);
    this.addSql(`alter table "room" add constraint "room_room_type_id_foreign" foreign key ("room_type_id") references "room_type" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "room" drop constraint "room_room_type_id_foreign";`);

    this.addSql(`drop table if exists "room_type" cascade;`);

    this.addSql(`alter table "room" drop column "room_type_id";`);

    this.addSql(`alter table "room" add column "type" varchar(255) not null;`);
  }

}
