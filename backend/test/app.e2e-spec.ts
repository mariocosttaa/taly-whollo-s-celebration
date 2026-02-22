import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AppController', () => {
    it('GET / returns Hello World!', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Visits', () => {
    it('POST /visits accepts a visit (no auth)', () => {
      return request(app.getHttpServer())
        .post('/visits')
        .send({ page: 'home' })
        .expect(201);
    });

    it('POST /visits accepts a visit with name', () => {
      return request(app.getHttpServer())
        .post('/visits')
        .send({ page: 'home', name: 'Test Visitor' })
        .expect(201);
    });
  });

  describe('RSVP', () => {
    it('POST /rsvp accepts a response (no auth)', () => {
      return request(app.getHttpServer())
        .post('/rsvp')
        .send({
          name: 'E2E Guest',
          email: 'e2e@test.com',
          attendance: 'confirmed',
          message: 'Test',
        })
        .expect(201);
    });
  });
});
