import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../app.module';
import { OidcAuthGuard, RoleGuard } from '../auth/guards/oidc-auth.guard';

const globalPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
});

describe('Services (e2e)', () => {
  let app: INestApplication<App>;
  let unauthApp: INestApplication<App>;
  let createdServiceId: string;
  let secondServiceId: string;

  const stamp = Date.now();
  const sharedTag = `tag-shared-${stamp}`;

  const testService = {
    name: `Test Service A ${stamp}`,
    description: 'Web development and hosting',
    tags: [sharedTag, `tag-a-${stamp}`],
    icon: 'code',
  };

  const secondService = {
    name: `Test Service B ${stamp}`,
    description: 'Cloud infrastructure',
    tags: [sharedTag, `tag-b-${stamp}`],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(OidcAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(globalPipe);
    await app.init();

    const unauthFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    unauthApp = unauthFixture.createNestApplication();
    unauthApp.useGlobalPipes(globalPipe);
    await unauthApp.init();
  });

  afterAll(async () => {
    await app.close();
    await unauthApp.close();
  });

  describe('POST /services', () => {
    it('returns 401 when not authenticated', async () => {
      await request(unauthApp.getHttpServer())
        .post('/services')
        .send(testService)
        .expect(401);
    });

    it('creates a service and returns 201 with tags as an array', async () => {
      const res = await request(app.getHttpServer())
        .post('/services')
        .send(testService)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body).toMatchObject({
        name: testService.name,
        description: testService.description,
        icon: testService.icon,
      });
      expect(res.body.tags).toEqual(testService.tags);

      createdServiceId = res.body.id;
    });

    it('creates a second service sharing a tag', async () => {
      const res = await request(app.getHttpServer())
        .post('/services')
        .send(secondService)
        .expect(201);

      secondServiceId = res.body.id;
    });

    it('returns 400 when name is missing', async () => {
      const { name: _name, ...withoutName } = testService;
      await request(app.getHttpServer()).post('/services').send(withoutName).expect(400);
    });

    it('returns 400 when a tag contains the ^ delimiter', async () => {
      await request(app.getHttpServer())
        .post('/services')
        .send({ ...testService, name: `Bad Tags ${stamp}`, tags: ['inva^lid'] })
        .expect(400);
    });

    it('returns 400 when a tag contains a comma', async () => {
      await request(app.getHttpServer())
        .post('/services')
        .send({ ...testService, name: `Bad Tags ${stamp}`, tags: ['inva,lid'] })
        .expect(400);
    });

    it('returns 400 for a duplicate service name', async () => {
      await request(app.getHttpServer()).post('/services').send(testService).expect(400);
    });
  });

  describe('GET /services', () => {
    it('is public and returns all services with 200', async () => {
      const res = await request(unauthApp.getHttpServer()).get('/services').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((s: { id: string }) => s.id === createdServiceId)).toBe(true);
    });
  });

  describe('GET /services/tags', () => {
    it('is public and returns all tags without duplicates', async () => {
      const res = await request(unauthApp.getHttpServer()).get('/services/tags').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toContain(sharedTag);
      expect(res.body).toContain(`tag-a-${stamp}`);
      expect(res.body).toContain(`tag-b-${stamp}`);

      const occurrences = res.body.filter((tag: string) => tag === sharedTag).length;
      expect(occurrences).toBe(1);
    });
  });

  describe('GET /services/:id', () => {
    it('returns the service with 200 and parsed tags', async () => {
      const res = await request(unauthApp.getHttpServer())
        .get(`/services/${createdServiceId}`)
        .expect(200);

      expect(res.body).toMatchObject({
        id: createdServiceId,
        name: testService.name,
      });
      expect(res.body.tags).toEqual(testService.tags);
    });

    it('returns 404 for a non-existent UUID', async () => {
      const res = await request(unauthApp.getHttpServer())
        .get('/services/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body).toMatchObject({ statusCode: 404 });
    });

    it('returns 406 for a malformed UUID', async () => {
      await request(unauthApp.getHttpServer()).get('/services/not-a-uuid').expect(406);
    });
  });

  describe('PATCH /services/:id', () => {
    it('returns 401 when not authenticated', async () => {
      await request(unauthApp.getHttpServer())
        .patch(`/services/${createdServiceId}`)
        .send({ description: 'updated' })
        .expect(401);
    });

    it('updates description and tags with 200', async () => {
      const newTags = [`tag-updated-${stamp}`];
      const res = await request(app.getHttpServer())
        .patch(`/services/${createdServiceId}`)
        .send({ description: 'Updated description', tags: newTags })
        .expect(200);

      expect(res.body).toMatchObject({
        id: createdServiceId,
        description: 'Updated description',
      });
      expect(res.body.tags).toEqual(newTags);
    });

    it('keeps existing tags when tags are omitted', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/services/${createdServiceId}`)
        .send({ description: 'Only description changed' })
        .expect(200);

      expect(res.body.tags).toEqual([`tag-updated-${stamp}`]);
    });

    it('returns 400 when a tag contains the ^ delimiter', async () => {
      await request(app.getHttpServer())
        .patch(`/services/${createdServiceId}`)
        .send({ tags: ['inva^lid'] })
        .expect(400);
    });

    it('returns 404 for a non-existent UUID', async () => {
      await request(app.getHttpServer())
        .patch('/services/00000000-0000-0000-0000-000000000000')
        .send({ description: 'nope' })
        .expect(404);
    });
  });

  describe('DELETE /services/:id', () => {
    it('returns 401 when not authenticated', async () => {
      await request(unauthApp.getHttpServer())
        .delete(`/services/${createdServiceId}`)
        .expect(401);
    });

    it('deletes the service and returns 200', async () => {
      await request(app.getHttpServer()).delete(`/services/${createdServiceId}`).expect(200);
    });

    it('returns 404 when fetching the deleted service', async () => {
      const res = await request(unauthApp.getHttpServer())
        .get(`/services/${createdServiceId}`)
        .expect(404);

      expect(res.body).toMatchObject({ statusCode: 404 });
    });

    it('excludes the deleted service tags from GET /services/tags', async () => {
      await request(app.getHttpServer()).delete(`/services/${secondServiceId}`).expect(200);

      const res = await request(unauthApp.getHttpServer()).get('/services/tags').expect(200);
      expect(res.body).not.toContain(sharedTag);
      expect(res.body).not.toContain(`tag-b-${stamp}`);
    });

    it('returns 404 for a non-existent UUID', async () => {
      await request(app.getHttpServer())
        .delete('/services/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
