import { Migration } from '@mikro-orm/migrations';

export class Migration20240618091933 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment_like" ("id" varchar(255) not null, "user_id" varchar(255) not null, "comment_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "liked_at" timestamptz not null, constraint "comment_like_pkey" primary key ("id", "user_id", "comment_id"));');

    this.addSql('alter table "comment_like" add constraint "comment_like_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment_like" add constraint "comment_like_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');

    this.addSql('drop table if exists "comment_liked_by" cascade;');

    this.addSql('alter table "list" alter column "description" type varchar(1000) using ("description"::varchar(1000));');

    this.addSql('alter table "comment" drop column "liked_at";');

    this.addSql('alter table "comment" alter column "comment" type varchar(1500) using ("comment"::varchar(1500));');
  }

  async down(): Promise<void> {
    this.addSql('create table "comment_liked_by" ("comment_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "comment_liked_by_pkey" primary key ("comment_id", "user_id"));');

    this.addSql('alter table "comment_liked_by" add constraint "comment_liked_by_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "comment_liked_by" add constraint "comment_liked_by_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "comment_like" cascade;');

    this.addSql('alter table "list" alter column "description" type varchar(255) using ("description"::varchar(255));');

    this.addSql('alter table "comment" add column "liked_at" timestamptz not null;');
    this.addSql('alter table "comment" alter column "comment" type varchar(255) using ("comment"::varchar(255));');
  }

}
