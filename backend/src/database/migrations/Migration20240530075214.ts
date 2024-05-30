import { Migration } from '@mikro-orm/migrations';

export class Migration20240530075214 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" alter column "description" type varchar(600) using ("description"::varchar(600));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" alter column "description" type varchar(255) using ("description"::varchar(255));');
  }

}
