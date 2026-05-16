import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('sessions')
@Index(['userId', 'isActive'])
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'device_fingerprint', nullable: true })
  deviceFingerprint: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_activity_at', type: 'timestamptz' })
  lastActivityAt: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
