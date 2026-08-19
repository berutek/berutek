import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { Logger } from '@nestjs/common/services/logger.service';
import session from 'express-session';
import { SessionStore } from './modules/auth/services/session.store';
import { DataSource } from 'typeorm';
import { Session } from './modules/auth/entities/session.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const apiPrefix = configService.get<string>('app.apiPrefix')!;
  const isProd = process.env.NODE_ENV === 'production';

  const datasource = app.get(DataSource);
  const sessionRepository = datasource.getRepository(Session);

  const sessionStore = new SessionStore(sessionRepository);

  app.use(helmet())

  app.use(
    session({
      store: sessionStore,
      secret: configService.get<string>('session.secret')!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'lax' : 'lax',
        maxAge: 10 * 60 * 1000, // 10 minutes — only needed for the OIDC handshake
      },
    }),
  );

  app.enableCors({
    origin: configService.get<string>('app.corsOrigin') || '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  
  await app.listen(port);
  Logger.log(`Server running on port ${port} with API prefix '${apiPrefix}'`);

  // Cleanup expired sessions every hour
  setInterval(
    async () => {
      await sessionStore.cleanupExpiredSessions();
    },
    60 * 60 * 1000,
  );
}
bootstrap();
