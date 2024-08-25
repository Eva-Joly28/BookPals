import { Migration } from '@mikro-orm/migrations';

export class Migration20240825130643 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "conversation" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "last_message_date" timestamptz null, constraint "conversation_pkey" primary key ("id"));');

    this.addSql('create table "conversation_participants" ("conversation_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "conversation_participants_pkey" primary key ("conversation_id", "user_id"));');

    this.addSql('alter table "conversation_participants" add constraint "conversation_participants_conversation_id_foreign" foreign key ("conversation_id") references "conversation" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "conversation_participants" add constraint "conversation_participants_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "message" add column "conversation_id" varchar(255) not null;');
    this.addSql('alter table "message" add constraint "message_conversation_id_foreign" foreign key ("conversation_id") references "conversation" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "message" drop constraint "message_conversation_id_foreign";');

    this.addSql('alter table "conversation_participants" drop constraint "conversation_participants_conversation_id_foreign";');

    this.addSql('drop table if exists "conversation" cascade;');

    this.addSql('drop table if exists "conversation_participants" cascade;');

    this.addSql('alter table "message" drop column "conversation_id";');
  }

}
