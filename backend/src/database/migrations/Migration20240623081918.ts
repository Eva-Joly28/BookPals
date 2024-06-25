import { Migration } from '@mikro-orm/migrations';

export class Migration20240623081918 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "list" alter column "name" type varchar(1000) using ("name"::varchar(1000));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "list" alter column "name" type varchar(255) using ("name"::varchar(255));');
  }

}
