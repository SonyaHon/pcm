import 'jest-extended';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserModule } from '../src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../src/entities/user.entity';
import { unlink } from 'fs-extra';
import { UserService } from '../src/user/user.service';
import { UserRole } from '../src/user/user.domain';
import * as request from 'supertest';
import * as session from 'express-session';

describe('AppController (e2e)', () => {
  let module: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'user.e2e.sqlite',
          synchronize: true,
          entities: [UserEntity],
        }),
      ],
    }).compile();

    module = moduleFixture.createNestApplication();
    module.use(session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false
    }));
    await module.init();
  });

  describe('Login', () => {
    it('With right credentials', async () => {
      const user = await module.get<UserService>(UserService).createUser({
        username: 'r1',
        password: 'root',
        role: UserRole.ADMIN,
      });

      const { body } = await request(module.getHttpServer())
        .post('/user/login')
        .send({
          username: 'r1',
          password: 'root',
        })
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);

      expect(body).toStrictEqual(user.getWithoutSensitiveData());
    });

    it('With wrong username', async () => {
      await module.get<UserService>(UserService).createUser({
        username: 'r2',
        password: 'root',
        role: UserRole.ADMIN,
      });

      const { body } = await request(module.getHttpServer())
        .post('/user/login')
        .send({
          username: 'wrong username',
          password: 'root',
        })
        .set('Accept', 'application/json')
        .expect(HttpStatus.FORBIDDEN);
    });

    it('With wrong password', async () => {
      await module.get<UserService>(UserService).createUser({
        username: 'r3',
        password: 'root',
        role: UserRole.ADMIN,
      });

      const { body } = await request(module.getHttpServer())
        .post('/user/login')
        .send({
          username: 'r3',
          password: 'wrong password',
        })
        .set('Accept', 'application/json')
        .set('Cookie', [])
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('Get self', () => {
    it('Should fail without login', async () => {
      const user = await module.get<UserService>(UserService).createUser({
        username: 'r4',
        password: 'root',
        role: UserRole.ADMIN,
      });

      const { body } = await request(module.getHttpServer())
        .get('/user')
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should return with login', async () => {
      const user = await module.get<UserService>(UserService).createUser({
        username: 'r5',
        password: 'root',
        role: UserRole.ADMIN,
      });

      const result = await request(module.getHttpServer())
        .post('/user/login')
        .send({ username: 'r5', password: 'root' })
        .set('Accept', 'application/json');


      const { body } = await request(module.getHttpServer())
        .get('/user')
        .set('Cookie', result.get('Set-Cookie'))
        .expect(HttpStatus.OK);

      expect(body).toStrictEqual(user.getWithoutSensitiveData());
    });

    it('Should fail after logout', async () => {
      const user = await module.get<UserService>(UserService).createUser({
        username: 'r6',
        password: 'root',
        role: UserRole.ADMIN,
      });

      const loginResult = await request(module.getHttpServer())
          .post('/user/login')
          .send({ username: 'r6', password: 'root' })
          .set('Accept', 'application/json');

      await request(module.getHttpServer())
          .get('/user/logout')
          .set('Cookie', loginResult.get('Set-Cookie'))
          .expect(HttpStatus.OK);

      const { body } = await request(module.getHttpServer())
          .get('/user')
          .set('Cookie', loginResult.get('Set-Cookie'))
          .expect(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(async () => {
    await unlink('user.e2e.sqlite');
  });
});
