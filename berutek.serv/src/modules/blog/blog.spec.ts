import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
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

const sessionUser = {
  id: 'test-user-id',
  username: 'test-admin',
  email: 'test-admin@berutek.dev',
  displayname: 'Test Admin',
  groups: ['admin'],
};

// The blog controller reads session.user for createdBy, so the guard mock
// must attach the session the way the real OIDC flow would
const authenticatedGuard = {
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.session = { user: sessionUser };
    return true;
  },
};

describe('Blogs (e2e)', () => {
  let app: INestApplication<App>;
  let unauthApp: INestApplication<App>;
  let createdBlogId: string;
  let secondBlogId: string;

  const stamp = Date.now();

  const testBlog = {
    title: `Test Blog A ${stamp}`,
    description: 'A post about web development',
    content: '# Hello\n\nThis is the first test post.',
    tags: ['testing', 'nestjs'],
    category: 'update',
  };

  const secondBlog = {
    title: `Test Blog B ${stamp}`,
    description: 'A post about cloud infrastructure',
    content: 'Second test post body.',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(OidcAuthGuard)
      .useValue(authenticatedGuard)
      .overrideGuard(RoleGuard)
      .useValue(authenticatedGuard)
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

  describe('POST /blogs', () => {
    it('returns 401 when not authenticated', async () => {
      await request(unauthApp.getHttpServer())
        .post('/blogs')
        .send(testBlog)
        .expect(401);
    });

    it('creates a blog and returns 201 with createdBy from the session', async () => {
      const res = await request(app.getHttpServer())
        .post('/blogs')
        .send(testBlog)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body).toMatchObject({
        title: testBlog.title,
        description: testBlog.description,
        content: testBlog.content,
        tags: testBlog.tags,
        category: testBlog.category,
        createdBy: sessionUser.username,
      });

      createdBlogId = res.body.id;
    });

    it('defaults tags to [] and returns 400 for an unknown category', async () => {
      await request(app.getHttpServer())
        .post('/blogs')
        .send({ ...testBlog, title: `Bad Category ${stamp}`, category: 'nonsense' })
        .expect(400);
    });

    it('ignores a client-supplied createdBy', async () => {
      const res = await request(app.getHttpServer())
        .post('/blogs')
        .send({ ...secondBlog, createdBy: 'attacker' })
        .expect(201);

      expect(res.body.createdBy).toBe(sessionUser.username);

      secondBlogId = res.body.id;
    });

    it('returns 400 when title is missing', async () => {
      const { title: _title, ...withoutTitle } = testBlog;
      await request(app.getHttpServer()).post('/blogs').send(withoutTitle).expect(400);
    });

    it('returns 400 when content is empty', async () => {
      await request(app.getHttpServer())
        .post('/blogs')
        .send({ ...testBlog, title: `Empty Content ${stamp}`, content: '' })
        .expect(400);
    });

    it('returns 400 for a duplicate title', async () => {
      await request(app.getHttpServer()).post('/blogs').send(testBlog).expect(400);
    });
  });

  describe('GET /blogs', () => {
    it('is public and returns all blogs with 200', async () => {
      const res = await request(unauthApp.getHttpServer()).get('/blogs').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((b: { id: string }) => b.id === createdBlogId)).toBe(true);
    });
  });

  describe('GET /blogs/:id', () => {
    it('is public and returns the blog with 200', async () => {
      const res = await request(unauthApp.getHttpServer())
        .get(`/blogs/${createdBlogId}`)
        .expect(200);

      expect(res.body).toMatchObject({
        id: createdBlogId,
        title: testBlog.title,
        content: testBlog.content,
      });
    });

    it('returns 404 for a non-existent UUID', async () => {
      const res = await request(unauthApp.getHttpServer())
        .get('/blogs/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body).toMatchObject({ statusCode: 404 });
    });

    it('returns 406 for a malformed UUID', async () => {
      await request(unauthApp.getHttpServer()).get('/blogs/not-a-uuid').expect(406);
    });
  });

  describe('PATCH /blogs/:id', () => {
    it('returns 401 when not authenticated', async () => {
      await request(unauthApp.getHttpServer())
        .patch(`/blogs/${createdBlogId}`)
        .send({ description: 'updated' })
        .expect(401);
    });

    it('updates description and content with 200', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/blogs/${createdBlogId}`)
        .send({ description: 'Updated description', content: 'Updated content.' })
        .expect(200);

      expect(res.body).toMatchObject({
        id: createdBlogId,
        title: testBlog.title,
        description: 'Updated description',
        content: 'Updated content.',
      });
    });

    it('returns 400 when renaming to an existing title', async () => {
      await request(app.getHttpServer())
        .patch(`/blogs/${createdBlogId}`)
        .send({ title: secondBlog.title })
        .expect(400);
    });

    it('allows keeping the same title', async () => {
      await request(app.getHttpServer())
        .patch(`/blogs/${createdBlogId}`)
        .send({ title: testBlog.title, description: 'Same title again' })
        .expect(200);
    });

    it('returns 404 for a non-existent UUID', async () => {
      await request(app.getHttpServer())
        .patch('/blogs/00000000-0000-0000-0000-000000000000')
        .send({ description: 'nope' })
        .expect(404);
    });
  });

  describe('DELETE /blogs/:id', () => {
    it('returns 401 when not authenticated', async () => {
      await request(unauthApp.getHttpServer())
        .delete(`/blogs/${createdBlogId}`)
        .expect(401);
    });

    it('deletes the blog and returns 200', async () => {
      await request(app.getHttpServer()).delete(`/blogs/${createdBlogId}`).expect(200);
    });

    it('returns 404 when fetching the deleted blog', async () => {
      const res = await request(unauthApp.getHttpServer())
        .get(`/blogs/${createdBlogId}`)
        .expect(404);

      expect(res.body).toMatchObject({ statusCode: 404 });
    });

    it('excludes the deleted blog from GET /blogs', async () => {
      const res = await request(unauthApp.getHttpServer()).get('/blogs').expect(200);
      expect(res.body.some((b: { id: string }) => b.id === createdBlogId)).toBe(false);
    });

    it('returns 404 for a non-existent UUID', async () => {
      await request(app.getHttpServer())
        .delete('/blogs/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('cleans up the second blog', async () => {
      await request(app.getHttpServer()).delete(`/blogs/${secondBlogId}`).expect(200);
    });
  });
});
