import { Migration } from '@mikro-orm/migrations';

export class Migration20240530075617 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" alter column "description" type varchar(1500) using ("description"::varchar(1500));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" alter column "description" type varchar(600) using ("description"::varchar(600));');
  }

}
