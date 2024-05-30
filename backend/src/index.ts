import './core/initializers/env.js';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import initDb from './database/mikro-orm.js';
import { MikroORM } from '@mikro-orm/postgresql';
import express from 'express';
useContainer(Container);


let app: express.Express = express();

app = useExpressServer(app, {
  routePrefix: process.env.API_ROUTE_PREFIX,
  defaultErrorHandler: true,
  controllers: [path.join(__dirname, '/api/controllers/*.js')],
  middlewares: [
    path.join(__dirname, '/api/middlewares/*.js'),
    path.join(__dirname, '/core/middlewares/*.js'),
  ],
  interceptors: [path.join(__dirname, '/api/interceptors/*.js')],
});


import swaggerSchema from './core/initializers/swagger.js';
import { BookRepository } from './api/repositories/book.repository.js';
if (process.env.SWAGGER_ROUTE) {
  app.use(`${process.env.SWAGGER_ROUTE}`, swaggerUi.serve);
  app.get(`${process.env.SWAGGER_ROUTE}`, swaggerUi.setup(swaggerSchema));
}

const port = parseInt(process.env.PORT ?? '3000');

export const DI = {} as {
  orm: MikroORM;
  server: express.Express;
};


export const init = (async () => {
  const orm = await initDb();
  app.listen(port, () => {
    console.log('Server is running on port 3000');
  });
  DI.orm = orm;
  DI.server = app;
  Container.set('bookRepo', new BookRepository(DI.orm.em.fork()));
})();
