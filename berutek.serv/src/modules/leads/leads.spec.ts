import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../app.module';
import { RoleGuard } from '../auth/guards/oidc-auth.guard';

const globalPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
});

describe('Leads (e2e)', () => {
  let app: INestApplication<App>;
  let unauthApp: INestApplication<App>;
  let createdLeadUuid: string;

  const testLead = {
    name: 'Jane Smith',
    email: `lead_${Date.now()}@example.com`,
    company: 'Acme Corp',
    description: 'Interested in the enterprise plan',
    severity: 'medium',
    status: 'new',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
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

  describe('POST /leads', () => {
    it('creates a lead and returns 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/leads')
        .send(testLead)
        .expect(201);

      expect(res.body.uuid).toBeDefined();
      expect(res.body).toMatchObject({
        name: testLead.name,
        email: testLead.email,
        company: testLead.company,
        severity: testLead.severity,
        status: testLead.status,
      });

      createdLeadUuid = res.body.uuid;
    });

    it('returns 400 when name is missing', async () => {
      const { name: _name, ...withoutName } = testLead;
      await request(app.getHttpServer()).post('/leads').send(withoutName).expect(400);
    });

    it('returns 400 when email is missing', async () => {
      const { email: _email, ...withoutEmail } = testLead;
      await request(app.getHttpServer()).post('/leads').send(withoutEmail).expect(400);
    });

    it('returns 400 for an invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/leads')
        .send({ ...testLead, email: 'not-an-email' })
        .expect(400);
    });

    it('returns 400 for an invalid severity value', async () => {
      await request(app.getHttpServer())
        .post('/leads')
        .send({ ...testLead, severity: 'critical' })
        .expect(400);
    });

    it('returns 400 for an invalid status value', async () => {
      await request(app.getHttpServer())
        .post('/leads')
        .send({ ...testLead, status: 'pending' })
        .expect(400);
    });
  });

  describe('GET /leads', () => {
    it('returns 401 when not authenticated', async () => {
      await request(unauthApp.getHttpServer()).get('/leads').expect(401);
    });

    it('returns all leads with 200 when authenticated as admin', async () => {
      const res = await request(app.getHttpServer()).get('/leads').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((l: { uuid: string }) => l.uuid === createdLeadUuid)).toBe(true);
    });
  });

  describe('GET /leads/:uuid', () => {
    it('returns 401 when not authenticated', async () => {
      await request(unauthApp.getHttpServer())
        .get(`/leads/${createdLeadUuid}`)
        .expect(401);
    });

    it('returns the lead with 200 when authenticated as admin', async () => {
      const res = await request(app.getHttpServer())
        .get(`/leads/${createdLeadUuid}`)
        .expect(200);

      expect(res.body).toMatchObject({
        uuid: createdLeadUuid,
        name: testLead.name,
        email: testLead.email,
      });
    });

    it('returns 404 for a non-existent UUID', async () => {
      const res = await request(app.getHttpServer())
        .get('/leads/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body).toMatchObject({ statusCode: 404 });
    });
  });

  describe('DELETE /leads/:uuid', () => {
    it('deletes the lead and returns 200', async () => {
      await request(app.getHttpServer())
        .delete(`/leads/${createdLeadUuid}`)
        .expect(200);
    });

    it('returns 404 when fetching the deleted lead', async () => {
      const res = await request(app.getHttpServer())
        .get(`/leads/${createdLeadUuid}`)
        .expect(404);

      expect(res.body).toMatchObject({ statusCode: 404 });
    });
  });
});
