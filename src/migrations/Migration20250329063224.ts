import { Migration } from '@mikro-orm/migrations';

export class Migration20250329063224 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "maintenance" ("id" varchar(255) not null, "equipment_id" varchar(255) not null, "equipment_name" varchar(255) not null, "maintenance_type" text check ("maintenance_type" in ('preventive', 'corrective', 'predictive')) not null, "description" varchar(255) not null, "start_date" timestamptz not null, "priority" text check ("priority" in ('low', 'medium', 'high')) not null, "assigned_to" varchar(255) not null, "status" text check ("status" in ('pending', 'in_progress', 'completed', 'cancelled')) not null default 'pending', "notes" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "maintenance_pkey" primary key ("id"));`);

    this.addSql(`create table "room" ("id" varchar(255) not null, "name" varchar(255) not null, "type" varchar(255) not null, "floor" int null, "area" int null, "price" int not null, "status" varchar(255) not null, "description" varchar(255) null, "amenities" text[] null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "room_pkey" primary key ("id"));`);

    this.addSql(`create table "settings" ("id" varchar(255) not null, "building_name" varchar(255) not null, "building_address" varchar(255) not null, "building_phone" varchar(255) not null, "building_email" varchar(255) not null, "language" varchar(255) not null default 'vi', "notifications" boolean not null default true, "email_notifications" boolean not null default true, "currency" varchar(255) not null default 'VND', "timezone" varchar(255) not null default 'Asia/Ho_Chi_Minh', "date_format" varchar(255) not null default 'DD/MM/YYYY', "income_categories" jsonb not null, "expense_categories" jsonb not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "settings_pkey" primary key ("id"));`);

    this.addSql(`create table "tenant" ("id" varchar(255) not null, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "identity_card" varchar(255) null, "date_of_birth" timestamptz null, "address" varchar(255) null, "start_date" timestamptz null, "end_date" timestamptz null, "room_id" varchar(255) null, "avatar" varchar(255) null, "status" varchar(255) not null default 'active', "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "tenant_pkey" primary key ("id"));`);

    this.addSql(`create table "contract" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "room_id" varchar(255) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "deposit" int not null, "monthly_rent" int not null, "terms" text[] not null, "status" varchar(255) not null default 'active', "termination_reason" varchar(255) null, "termination_date" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "contract_pkey" primary key ("id"));`);

    this.addSql(`create table "transaction" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "type" varchar(255) not null, "amount" int not null, "category" varchar(255) not null, "description" varchar(255) not null, "date" timestamptz not null, "room_id" varchar(255) null, "tenant_id" varchar(255) null, constraint "transaction_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "phone" int not null, "role" text check ("role" in ('admin', 'manager', 'staff')) not null, "status" text check ("status" in ('active', 'inactive')) not null, "password" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`alter table "tenant" add constraint "tenant_room_id_foreign" foreign key ("room_id") references "room" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "contract" add constraint "contract_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;`);
    this.addSql(`alter table "contract" add constraint "contract_room_id_foreign" foreign key ("room_id") references "room" ("id") on update cascade;`);

    this.addSql(`alter table "transaction" add constraint "transaction_room_id_foreign" foreign key ("room_id") references "room" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "transaction" add constraint "transaction_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tenant" drop constraint "tenant_room_id_foreign";`);

    this.addSql(`alter table "contract" drop constraint "contract_room_id_foreign";`);

    this.addSql(`alter table "transaction" drop constraint "transaction_room_id_foreign";`);

    this.addSql(`alter table "contract" drop constraint "contract_tenant_id_foreign";`);

    this.addSql(`alter table "transaction" drop constraint "transaction_tenant_id_foreign";`);

    this.addSql(`drop table if exists "maintenance" cascade;`);

    this.addSql(`drop table if exists "room" cascade;`);

    this.addSql(`drop table if exists "settings" cascade;`);

    this.addSql(`drop table if exists "tenant" cascade;`);

    this.addSql(`drop table if exists "contract" cascade;`);

    this.addSql(`drop table if exists "transaction" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}
