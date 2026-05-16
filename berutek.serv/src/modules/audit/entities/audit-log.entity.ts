import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum AuditAction {
    USER_REGISTERED = 'user.registered',
    USER_LOGGED_IN = 'user.logged_in',
    USER_LOGGED_OUT = 'user.logged_out',
    PASSWORD_CHANGED = 'user.password_changed',
    PASSWORD_RESET_REQUESTED = 'user.password_reset_requested',
    EMAIL_VERIFIED = 'user.email_verified',
    TWO_FACTOR_ENABLED = 'security.2fa_enabled',
    TWO_FACTOR_DISABLED = 'security.2fa_disabled',
    TWO_FACTOR_VERIFIED = 'security.2fa_verified',
    RECOVERY_CODE_USED = 'security.recovery_code_used',
    TOKEN_REUSED = 'security.token_reuse_detected',
    ACCOUNT_LOCKED = 'security.account_locked',
    SESSION_REVOKED = 'security.session_revoked',
}

@Entity('audit_logs')
@Index(['userId', 'action', 'createdAt'])
@Index(['action', 'createdAt'])
export class AuditLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ name: 'user_id', nullable: true })
    userId: string  | null;
    @Column({type: 'enum', enum: AuditAction})
    action: AuditAction;
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;
    @Column({ name: 'ip_address', type: 'varchar', length: 255, nullable: true })
    ipAddress: string;
    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent: string;

    @ManyToOne(() => User, (user) => user.auditLogs, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user:User
}