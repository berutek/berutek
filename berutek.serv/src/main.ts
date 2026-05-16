import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { Logger } from '@nestjs/common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const apiPrefix = configService.get<string>('app.apiPrefix')!;

  app.use(helmet())

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
}
bootstrap();
