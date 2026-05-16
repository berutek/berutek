import {Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { Exclude } from 'class-transformer';
import { AuditLogEntity } from '../../audit/entities/audit-log.entity';
import { LoginAttemptEntity } from '../../audit/entities/login-attempt.entity';
import { RefreshTokenEntity } from '../../tokens/entities/refresh-token.entity';
import { RoleEntity } from '../../roles/entities/role.entity';
import { TwoFactorAuth } from '../../two-factor/entities/two-factor.entity';
import { RecoveryCode } from '../../two-factor/entities/recovery-code.entity';
import { SessionEntity } from '../../session/entities/session.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ name: "password_hash", type: 'varchar', length: 255 })
    @Exclude({ toPlainOnly: true })
    passwordHash: string;


    @Column({ name: 'failed_login_attempts', default: 0 })
    failedLoginAttempts: number;
    @Column({ name: 'locked_until', type: 'timestamptz', nullable: true })
    lockedUntil: Date | null;
    @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
    lastLoginAt: Date | null;
    @Column({ name: 'password_changed_at', type: 'timestamptz', nullable: true })
    passwordChangedAt: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @Column({ name: 'is_email_verified', default: false })
    isEmailVerified: boolean;
    @Column({ name: 'is_2fa_enabled', default: false })
    is2faEnabled: boolean;
    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @OneToMany(() => SessionEntity, (session) => session.user)
    sessions: SessionEntity[];

    @OneToMany(() => RecoveryCode, (recoveryCode) => recoveryCode.user)
    recoveryCodes: RecoveryCode[];

    @OneToOne(() => TwoFactorAuth, (twoFactorAuth) => twoFactorAuth.user)
    twoFactorAuth: TwoFactorAuth;

    @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshTokenEntity[];

    @OneToMany(() => LoginAttemptEntity, (loginAttempt) => loginAttempt.user)
    loginAttempts: LoginAttemptEntity[];

    @OneToMany(() => AuditLogEntity, (auditLog) => auditLog.user)
    auditLogs: AuditLogEntity[];

    @ManyToMany(() => RoleEntity, (role) => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: RoleEntity[];

}