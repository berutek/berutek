import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./services/auth.service";
import { UserModule } from "../users/user.module";
import { UserService } from "../users/services/user.service";
import { initializeOidcClient, OidcStrategy } from "./strategies/oidc.strategy";
import { AuthController } from "./controllers/auth.controller";
import type { Client } from "openid-client";

// @Module({
//     imports: [
//         TypeOrmModule.forFeature([User, TwoFactorAuth, RecoveryCode, RefreshTokenEntity, SessionEntity, AuditLogEntity, LoginAttemptEntity]),
//         PassportModule.register({ defaultStrategy: 'jwt' }),
//         JwtModule.registerAsync({
//             imports: [ConfigModule],
//             inject: [ConfigService],
//             useFactory: (configService: ConfigService) => ({
//                 secret: configService.get<string>('jwt.accessSecret'),
//                 signOptions: {
//                     expiresIn: configService.get<string>('jwt.accessExpiration') as any,
//                     issuer: configService.get<string>('jwt.issuer'),
//                     audience: "nestjs-auth-api"
//                 },
//             }),
//         }),
//     ],
//     controllers: [AuthController],
//     providers: [AuthService, TwoFactorService, TokenService, JwtStrategy, SessionService, AuditService],
//     exports: [AuthService, TokenService]
// })
@Module({
  imports: [PassportModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'OIDC_CLIENT',
      useFactory: async (configService: ConfigService) => {
        try {
          return await initializeOidcClient(configService);
        } catch (err) {
          console.error('[AuthModule] OIDC client initialization failed — OIDC login will be unavailable:', err);
          return null;
        }
      },
      inject: [ConfigService],
    },
    {
      provide: OidcStrategy,
      useFactory: (client: Client | null, usersService: UserService) => {
        if (!client) return null;
        return new OidcStrategy(client, usersService);
      },
      inject: ['OIDC_CLIENT', UserService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}