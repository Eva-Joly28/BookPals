import { Migration } from '@mikro-orm/migrations';

export class Migration20240615183504 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_following" ("user_1_id" varchar(255) not null, "user_2_id" varchar(255) not null, constraint "user_following_pkey" primary key ("user_1_id", "user_2_id"));');

    this.addSql('alter table "user_following" add constraint "user_following_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_following" add constraint "user_following_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_following" cascade;');
  }

}
