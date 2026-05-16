import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../modules/users/entities/user.entity";
import { SessionEntity } from "../modules/session/entities/session.entity";
import { RefreshTokenEntity } from "../modules/tokens/entities/refresh-token.entity";
import { TwoFactorAuth } from "../modules/two-factor/entities/two-factor.entity";
import { RecoveryCode } from "../modules/two-factor/entities/recovery-code.entity";
import { AuditLogEntity } from "../modules/audit/entities/audit-log.entity";
import { LoginAttemptEntity } from "../modules/audit/entities/login-attempt.entity";
import { RoleEntity } from "../modules/roles/entities/role.entity";
import { PermissionEntity } from "../modules/roles/entities/permission.entity";

const entities = [
    User,
    SessionEntity,
    RefreshTokenEntity,
    TwoFactorAuth,
    RecoveryCode,
    AuditLogEntity,
    LoginAttemptEntity,
    RoleEntity,
    PermissionEntity,
];

@Module({
    imports: [TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            username: configService.get<string>('database.username'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.database'),
            synchronize: configService.get<boolean>('database.synchronize'),
            logging: configService.get<boolean>('database.logging'),
            autoLoadEntities: true,
            entities,
        }),
    })],
})
export class DatabaseModule {}