import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// import { AuditLogEntity } from '../../audit/entities/audit-log.entity';
// import { SessionEntity } from '../../session/entities/session.entity';
import { ReviewEntity } from '../../reviews/entities/review.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    displayname: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column('simple-array', { nullable: true })
    groups: string[];

    @Column({ nullable: true })
    authelia_sub: string; // Authelia subject ID

    @Column({ nullable: true })
    avatarUrl: string;

    // @Column({ name: 'failed_login_attempts', default: 0 })
    // failedLoginAttempts: number;
    // @Column({ name: 'locked_until', type: 'timestamptz', nullable: true })
    // lockedUntil: Date | null;
    // @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
    // lastLoginAt: Date | null;
    // @Column({ name: 'password_changed_at', type: 'timestamptz', nullable: true })
    // passwordChangedAt: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    // @OneToMany(() => SessionEntity, (session) => session.user)
    // sessions: SessionEntity[];

    // @OneToOne(() => ReviewEntity, (review) => review.user)
    // review: ReviewEntity;

}