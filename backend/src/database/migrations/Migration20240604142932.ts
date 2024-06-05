import { Migration } from '@mikro-orm/migrations';

export class Migration20240604142932 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "list_liked_by" ("list_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "list_liked_by_pkey" primary key ("list_id", "user_id"));');

    this.addSql('create table "comment_liked_by" ("comment_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "comment_liked_by_pkey" primary key ("comment_id", "user_id"));');

    this.addSql('alter table "list_liked_by" add constraint "list_liked_by_list_id_foreign" foreign key ("list_id") references "list" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "list_liked_by" add constraint "list_liked_by_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "comment_liked_by" add constraint "comment_liked_by_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "comment_liked_by" add constraint "comment_liked_by_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "user_favorites_lists" cascade;');

    this.addSql('alter table "book" add column "views" int not null default 0;');

    this.addSql('alter table "user" add column "is_verified" boolean not null default true, add column "verification_token" varchar(255) not null default \'\', add column "refresh_token" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('create table "user_favorites_lists" ("user_id" varchar(255) not null, "list_id" varchar(255) not null, constraint "user_favorites_lists_pkey" primary key ("user_id", "list_id"));');

    this.addSql('alter table "user_favorites_lists" add constraint "user_favorites_lists_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favorites_lists" add constraint "user_favorites_lists_list_id_foreign" foreign key ("list_id") references "list" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "list_liked_by" cascade;');

    this.addSql('drop table if exists "comment_liked_by" cascade;');

    this.addSql('alter table "book" drop column "views";');

    this.addSql('alter table "user" drop column "is_verified", drop column "verification_token", drop column "refresh_token";');
  }

}
