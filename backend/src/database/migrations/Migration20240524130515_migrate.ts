import { Migration } from '@mikro-orm/migrations';

export class Migration20240524130515_migrate extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "password" varchar(255) null, "email" varchar(255) not null, "username" varchar(255) not null, "role" varchar(255) not null, "books_to_read" varchar(255) not null, "books_in_progress" text[] not null, "wish_list" text[] not null, "status" int not null default 0, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "rating" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "isbn" varchar(255) not null, "value" int not null, "user_id" varchar(255) not null, constraint "rating_pkey" primary key ("id"));');

    this.addSql('create table "list" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(255) not null, "books" text[] not null, "status" boolean not null, "key_words" text[] not null, "creator_id" varchar(255) not null, constraint "list_pkey" primary key ("id"));');

    this.addSql('create table "comment" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "isbn" varchar(255) not null, "comment" varchar(255) not null, "user_id" varchar(255) not null, constraint "comment_pkey" primary key ("id"));');

    this.addSql('create table "user_favorites_lists" ("user_id" varchar(255) not null, "list_id" varchar(255) not null, constraint "user_favorites_lists_pkey" primary key ("user_id", "list_id"));');

    this.addSql('alter table "rating" add constraint "rating_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "list" add constraint "list_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "comment" add constraint "comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user_favorites_lists" add constraint "user_favorites_lists_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favorites_lists" add constraint "user_favorites_lists_list_id_foreign" foreign key ("list_id") references "list" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "rating" drop constraint "rating_user_id_foreign";');

    this.addSql('alter table "list" drop constraint "list_creator_id_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_user_id_foreign";');

    this.addSql('alter table "user_favorites_lists" drop constraint "user_favorites_lists_user_id_foreign";');

    this.addSql('alter table "user_favorites_lists" drop constraint "user_favorites_lists_list_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "rating" cascade;');

    this.addSql('drop table if exists "list" cascade;');

    this.addSql('drop table if exists "comment" cascade;');

    this.addSql('drop table if exists "user_favorites_lists" cascade;');
  }

}
