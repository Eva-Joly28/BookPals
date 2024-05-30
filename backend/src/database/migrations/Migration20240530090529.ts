import { Migration } from '@mikro-orm/migrations';

export class Migration20240530090529 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" alter column "snippet" type varchar(350) using ("snippet"::varchar(350));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" alter column "snippet" type varchar(255) using ("snippet"::varchar(255));');
  }

}
