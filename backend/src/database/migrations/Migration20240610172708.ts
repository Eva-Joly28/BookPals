import { Migration } from '@mikro-orm/migrations';

export class Migration20240610172708 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" add column "rate" int not null;');

    this.addSql('alter table "user" add column "profile_picture" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" drop column "rate";');

    this.addSql('alter table "user" drop column "profile_picture";');
  }

}
