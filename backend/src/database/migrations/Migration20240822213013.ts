import { Migration } from '@mikro-orm/migrations';

export class Migration20240822213013 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "message" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "content" varchar(3000) not null, "is_read" boolean not null default false, "sender_id" varchar(255) not null, "receiver_id" varchar(255) not null, constraint "message_pkey" primary key ("id"));');

    this.addSql('alter table "message" add constraint "message_sender_id_foreign" foreign key ("sender_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_receiver_id_foreign" foreign key ("receiver_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "message" cascade;');
  }

}
