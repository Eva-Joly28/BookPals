import { Migration } from '@mikro-orm/migrations';

export class Migration20240530083340 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" alter column "cover" type varchar(350) using ("cover"::varchar(350));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" alter column "cover" type varchar(255) using ("cover"::varchar(255));');
  }

}
