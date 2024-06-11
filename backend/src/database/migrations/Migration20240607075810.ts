import { Migration } from '@mikro-orm/migrations';

export class Migration20240607075810 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" alter column "publisher" drop default;');
    this.addSql('alter table "book" alter column "publisher" type varchar(255) using ("publisher"::varchar(255));');
    this.addSql('alter table "book" alter column "description" drop default;');
    this.addSql('alter table "book" alter column "description" type varchar(1500) using ("description"::varchar(1500));');
    this.addSql('alter table "book" alter column "page_count" type int using ("page_count"::int);');
    this.addSql('alter table "book" alter column "snippet" drop default;');
    this.addSql('alter table "book" alter column "snippet" type varchar(350) using ("snippet"::varchar(350));');
    this.addSql('alter table "book" alter column "views" drop default;');
    this.addSql('alter table "book" alter column "views" type bigint using ("views"::bigint);');

    this.addSql('alter table "comment" add column "liked_at" timestamptz not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" alter column "publisher" type varchar(255) using ("publisher"::varchar(255));');
    this.addSql('alter table "book" alter column "publisher" set default \'\';');
    this.addSql('alter table "book" alter column "description" type varchar(1500) using ("description"::varchar(1500));');
    this.addSql('alter table "book" alter column "description" set default \'\';');
    this.addSql('alter table "book" alter column "page_count" type varchar(255) using ("page_count"::varchar(255));');
    this.addSql('alter table "book" alter column "snippet" type varchar(350) using ("snippet"::varchar(350));');
    this.addSql('alter table "book" alter column "snippet" set default \'\';');
    this.addSql('alter table "book" alter column "views" type int using ("views"::int);');
    this.addSql('alter table "book" alter column "views" set default 0;');

    this.addSql('alter table "comment" drop column "liked_at";');
  }

}
