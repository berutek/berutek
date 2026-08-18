import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { UserModule } from './modules/users/user.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customers/customer.module';
import { LeadModule } from './modules/leads/lead.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      load: [databaseConfig, configuration],
      cache: true,
    }),
    DatabaseModule,
    UserModule,
    LeadModule,
    ThrottlerModule.forRoot([
      {name: 'short', ttl: 1000, limit: 10},
      {name: 'medium', ttl: 60000, limit: 60},
      {name: 'long', ttl: 3600000, limit: 1000},
    ]),
    AuthModule,
    CustomerModule,
  ],
  providers: [
    //{provide: APP_GUARD, useClass: JwtAuthGuard},
    {provide: APP_GUARD, useClass: ThrottlerGuard},
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
