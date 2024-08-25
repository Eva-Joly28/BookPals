import { Migration } from '@mikro-orm/migrations';

export class Migration20240822212816 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" alter column "comment" type varchar(2500) using ("comment"::varchar(2500));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" alter column "comment" type varchar(1500) using ("comment"::varchar(1500));');
  }

}
