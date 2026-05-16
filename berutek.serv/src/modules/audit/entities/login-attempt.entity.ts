import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum LoginFailureReason {
    INVALID_CREDENTIALS = "invalid_credentials",
    ACCOUNT_LOCKED = "account_locked",
    ACCOUNT_DISABLED = "account_disabled",
    USER_NOT_FOUND = "user_not_found",
    INVALID_2FA = "invalid_2fa",
    EXPIRED_2FA = "expired_2fa",
    UNKNOWN_ERROR = "unknown_error"
}

@Entity('login_attempts')
@Index(['userId', 'attemptedAt'])
@Index(['ipAddress', 'attemptedAt'])
export class LoginAttemptEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    userId: string;
    @Column({ name: 'email_attempted', type: 'varchar', length: 255 })
    emailAttempted: string;
    @Column({ name: 'ip_address', type: 'varchar', length: 255 })
    ipAddress: string;
    @Column({ name: 'user_agent', type: 'text'})
    userAgent: string;
    @Column({ name: 'success', type: 'boolean' })
    success: boolean;
    @Column({ name: 'failure_reason', type:'enum', enum: LoginFailureReason, nullable: true })
    failureReason: LoginFailureReason | null;
    @Column({ name: 'attempted_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    attemptedAt: Date;

    @ManyToOne(() => User, (user) => user.loginAttempts, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
}