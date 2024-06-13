import { Migration } from '@mikro-orm/migrations';

export class Migration20240613065858 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_read_books" ("user_id" varchar(255) not null, "book_id" varchar(255) not null, constraint "user_read_books_pkey" primary key ("user_id", "book_id"));');

    this.addSql('alter table "user_read_books" add constraint "user_read_books_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_read_books" add constraint "user_read_books_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "user_books_read" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "user_books_read" ("user_id" varchar(255) not null, "book_id" varchar(255) not null, constraint "user_books_read_pkey" primary key ("user_id", "book_id"));');

    this.addSql('alter table "user_books_read" add constraint "user_books_read_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_books_read" add constraint "user_books_read_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "user_read_books" cascade;');
  }

}
