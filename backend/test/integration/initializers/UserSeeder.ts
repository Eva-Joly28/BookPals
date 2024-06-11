import { EntityManager, wrap } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../../../src/database/entities/User';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user1 = new User();
    wrap(user1).assign({
      id: "user1",
      username: 'raz',
      password: '12345678',
      email: 'raz@test.com',
    });
    em.persistAndFlush(user1);
    const user2 = new User();
    wrap(user2).assign({
      id: "user2",
      username: 'flo',
      password: '12345678',
      email: 'flo@test.com',
    });
    em.persistAndFlush(user2);
    const user3 = new User();
    wrap(user3).assign({
      id: "user3",
      username: 'yataa',
      password: '12345678',
      email: 'yataa@test.com',
    });
    em.persistAndFlush(user3);
    const user4 = new User();
    wrap(user4).assign({
      id: "user4",
      username: 'gaby',
      password: '12345678',
      email: 'gaby@test.com',
    });
    em.persistAndFlush(user4);
  }
}
