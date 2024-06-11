import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import { User } from '../../../src/database/entities/User';
import { DI } from '../../../src/index';
import '../../../src/core/initializers/env';
import { setTimeout } from 'timers';

describe('Users', () => {
  describe('list', () => {
    it('should get all users', () =>
      request(DI.server)
        .get(process.env.API_ROUTE_PREFIX + '/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.length).to.be.equal(4);
          expect(res.body[0].username).to.be.equal('raz');
          expect(res.body[1].username).to.be.equal('flo');
          expect(res.body[2].username).to.be.equal('yataa');
          expect(res.body[3].username).to.be.equal('gaby');
        }));
  });

  describe('get', () => {
    it('should get user flo', () =>
      request(DI.server)
        .get(process.env.API_ROUTE_PREFIX + '/users/user2')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.login).to.be.equal('flo');
        }));

    it('should get no user', () =>
      request(DI.server)
        .get(process.env.API_ROUTE_PREFIX + '/users/42')
        .expect('Content-Type', /json/)
        .expect(404));
  });


  describe('patch', () => {
    it('should not modify user with invalid mail', () =>
      request(DI.server)
        .put(process.env.API_ROUTE_PREFIX + '/users/2')
        .send({ email: 'flo@test' })
        .expect(400)
        .then(async () => {
          const userNotModified = await DI.orm.em
            .fork()
            .getRepository<User>('User')
            .findOne({ id: "user2" });
          expect(userNotModified?.email).to.be.equal('flo@test.com');
        }));
    it('should not modify user with empty mail', () =>
      request(DI.server)
        .put(process.env.API_ROUTE_PREFIX + '/users/user2')
        .send({ email: '' })
        .expect(400)
        .then(async () => {
          const userNotModified = await DI.orm.em
            .fork()
            .getRepository<User>('User')
            .findOne({ id: "user2" });
          expect(userNotModified?.email).to.be.equal('flo@test.com');
        }));

    it('should modify user flo mail', () =>
      request(DI.server)
        .put(process.env.API_ROUTE_PREFIX + '/users/2')
        .send({ email: 'floflo@test.com' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(async () => {
          const userModified = await DI.orm.em
            .fork()
            .getRepository<User>('User')
            .findOne({ id: "user2" });
          expect(userModified?.email).to.be.equal('floflo@test.com');
    }));
  });
  
});
