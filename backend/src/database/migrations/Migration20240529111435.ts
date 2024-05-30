import { Migration } from '@mikro-orm/migrations';

export class Migration20240529111435 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "book" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "book_id" varchar(255) not null, "title" varchar(255) not null, "authors" text[] not null, "published_date" varchar(255) not null, "publisher" varchar(255) not null, "description" varchar(255) not null default \'\', "isbn10" varchar(255) not null, "isbn13" varchar(255) not null, "page_count" varchar(255) not null, "default_image" varchar(255) not null, "cover" varchar(255) not null, "categories" text[] not null, "snippet" varchar(255) not null default \'\', "language" varchar(255) not null, constraint "book_pkey" primary key ("id"));');
    this.addSql('alter table "book" add constraint "book_book_id_unique" unique ("book_id");');

    this.addSql('create table "list_books" ("list_id" varchar(255) not null, "book_id" varchar(255) not null, constraint "list_books_pkey" primary key ("list_id", "book_id"));');

    this.addSql('create table "user_books_in_progress" ("user_id" varchar(255) not null, "book_id" varchar(255) not null, constraint "user_books_in_progress_pkey" primary key ("user_id", "book_id"));');

    this.addSql('create table "user_books_to_read" ("user_id" varchar(255) not null, "book_id" varchar(255) not null, constraint "user_books_to_read_pkey" primary key ("user_id", "book_id"));');

    this.addSql('create table "user_wish_list" ("user_id" varchar(255) not null, "book_id" varchar(255) not null, constraint "user_wish_list_pkey" primary key ("user_id", "book_id"));');

    this.addSql('alter table "list_books" add constraint "list_books_list_id_foreign" foreign key ("list_id") references "list" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "list_books" add constraint "list_books_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_books_in_progress" add constraint "user_books_in_progress_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_books_in_progress" add constraint "user_books_in_progress_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_books_to_read" add constraint "user_books_to_read_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_books_to_read" add constraint "user_books_to_read_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_wish_list" add constraint "user_wish_list_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_wish_list" add constraint "user_wish_list_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user" drop column "books_to_read", drop column "books_in_progress", drop column "wish_list";');

    this.addSql('alter table "user" alter column "role" type varchar(255) using ("role"::varchar(255));');
    this.addSql('alter table "user" alter column "role" set default \'User\';');

    this.addSql('alter table "rating" drop column "isbn";');

    this.addSql('alter table "rating" add column "book_id" varchar(255) not null;');
    this.addSql('alter table "rating" add constraint "rating_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade;');

    this.addSql('alter table "list" drop column "books";');

    this.addSql('alter table "comment" drop column "isbn";');

    this.addSql('alter table "comment" add column "book_id" varchar(255) not null;');
    this.addSql('alter table "comment" add constraint "comment_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "rating" drop constraint "rating_book_id_foreign";');

    this.addSql('alter table "list_books" drop constraint "list_books_book_id_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_book_id_foreign";');

    this.addSql('alter table "user_books_in_progress" drop constraint "user_books_in_progress_book_id_foreign";');

    this.addSql('alter table "user_books_to_read" drop constraint "user_books_to_read_book_id_foreign";');

    this.addSql('alter table "user_wish_list" drop constraint "user_wish_list_book_id_foreign";');

    this.addSql('drop table if exists "book" cascade;');

    this.addSql('drop table if exists "list_books" cascade;');

    this.addSql('drop table if exists "user_books_in_progress" cascade;');

    this.addSql('drop table if exists "user_books_to_read" cascade;');

    this.addSql('drop table if exists "user_wish_list" cascade;');

    this.addSql('alter table "user" add column "books_to_read" varchar(255) not null, add column "books_in_progress" text[] not null, add column "wish_list" text[] not null;');
    this.addSql('alter table "user" alter column "role" drop default;');
    this.addSql('alter table "user" alter column "role" type varchar(255) using ("role"::varchar(255));');

    this.addSql('alter table "rating" drop column "book_id";');

    this.addSql('alter table "rating" add column "isbn" varchar(255) not null;');

    this.addSql('alter table "list" add column "books" text[] not null;');

    this.addSql('alter table "comment" drop column "book_id";');

    this.addSql('alter table "comment" add column "isbn" varchar(255) not null;');
  }

}
