import { Options, ReflectMetadataProvider } from '@mikro-orm/postgresql';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';
import '../core/initializers/env';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import Container from 'typedi';

const options: Options = {
  metadataProvider: ReflectMetadataProvider,
  entities: ['./dist/src/database/entities'], // path to our JS entities (dist), relative to `baseDir`
  driver: PostgreSqlDriver,
  extensions: [Migrator, SeedManager],
  dbName: process.env.PG_DB_NAME,
  driverOptions:{
    connection : {ssl : {rejectUnauthorized: false }},
  },
  password: process.env.PG_PASSWORD,
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432'),
  migrations: {
    tableName: 'mikro_orm_migrations',
    allOrNothing: true,
    path: path.join(process.cwd(), 'dist/src/database/migrations'),
    pathTs: path.join(process.cwd(), 'src/database/migrations'),
    disableForeignKeys: false,
  },
};

export default options;
