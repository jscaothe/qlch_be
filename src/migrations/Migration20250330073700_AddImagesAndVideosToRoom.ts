import { Migration } from '@mikro-orm/migrations';

export class Migration20250330073700_AddImagesAndVideosToRoom extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "room" add column "images" text[] null;');
    this.addSql('alter table "room" add column "videos" text[] null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "room" drop column "images";');
    this.addSql('alter table "room" drop column "videos";');
  }

}
