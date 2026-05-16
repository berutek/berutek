import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { describe } from 'node:test';
import { AppModule } from '../../app.module';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let createdUserId: string;

  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
  };

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

  describe('POST /users', () => {
    it('creates a user and returns 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body).toMatchObject({ name: testUser.name, email: testUser.email });
      createdUserId = res.body.id;
    });
  });

  describe('GET /users', () => {
    it('returns all active users with 200', async () => {
      const res = await request(app.getHttpServer()).get('/users').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((u: { id: string }) => u.id === createdUserId)).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    it('returns the user with 200', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(200);

      expect(res.body).toMatchObject({ id: createdUserId, name: testUser.name, email: testUser.email });
    });

    it('returns 406 for a non-UUID id', async () => {
      const res = await request(app.getHttpServer()).get('/users/not-a-uuid').expect(406);

      expect(res.body.statusCode).toBe(406);
    });

    it('returns 404 for a valid UUID that does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body).toMatchObject({ statusCode: 404, error: expect.stringContaining('Not Found') });
    });
  });

  describe('PUT /users/:id', () => {
    it('updates the user and returns 200 with the new data', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .send({ name: 'Updated User' })
        .expect(200);

      expect(res.body).toMatchObject({ id: createdUserId, name: 'Updated User' });
    });
  });

  describe('DELETE /users/:id', () => {
    it('soft-deletes the user and returns 200', async () => {
      await request(app.getHttpServer()).delete(`/users/${createdUserId}`).expect(200);
    });

    it('returns 404 when fetching a deleted user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(404);

      expect(res.body).toMatchObject({ statusCode: 404, error: expect.stringContaining('Not Found') });
    });

    it('excludes the deleted user from GET /users', async () => {
      const res = await request(app.getHttpServer()).get('/users').expect(200);

      expect(res.body.some((u: { id: string }) => u.id === createdUserId)).toBe(false);
    });
  });
});
