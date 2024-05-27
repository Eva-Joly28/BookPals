import { MikroORM } from '@mikro-orm/postgresql';
import config from './mikro-orm.config.js';

const init = async () => {
  const orm = await MikroORM.init(config);
  if (process.env.NODE_ENV !== 'test') {
    const migrator = orm.getMigrator();
    await migrator.up();
  }
  return orm;
};

export default init;
