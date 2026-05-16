import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { TwoFactorAuth } from "../two-factor/entities/two-factor.entity";
import { RecoveryCode } from "../two-factor/entities/recovery-code.entity";
import { RefreshTokenEntity } from "../tokens/entities/refresh-token.entity";
import { LoginAttemptEntity } from "../audit/entities/login-attempt.entity";
import { AuditLogEntity } from "../audit/entities/audit-log.entity";
import { SessionEntity } from "../session/entities/session.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config/dist/config.module";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { TokenService } from "../tokens/token.service";
import { TwoFactorService } from "../two-factor/two-factor.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { SessionService } from "../session/session.service";
import { AuditService } from "../audit/audit.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, TwoFactorAuth, RecoveryCode, RefreshTokenEntity, SessionEntity, AuditLogEntity, LoginAttemptEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.accessSecret'),
                signOptions: {
                    expiresIn: configService.get<string>('jwt.accessExpiration') as any,
                    issuer: configService.get<string>('jwt.issuer'),
                    audience: "nestjs-auth-api"
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, TwoFactorService, TokenService, JwtStrategy, SessionService, AuditService],
    exports: [AuthService, TokenService]
})
export class AuthModule {}