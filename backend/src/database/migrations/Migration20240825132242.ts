import { Migration } from '@mikro-orm/migrations';

export class Migration20240825132242 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_blocked_users" ("user_1_id" varchar(255) not null, "user_2_id" varchar(255) not null, constraint "user_blocked_users_pkey" primary key ("user_1_id", "user_2_id"));');

    this.addSql('alter table "user_blocked_users" add constraint "user_blocked_users_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_blocked_users" add constraint "user_blocked_users_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_blocked_users" cascade;');
  }

}
