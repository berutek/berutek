import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
@Index(['tokenHash'], { unique: true })
@Index(['userId', 'isRevoked'])
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  // SHA-256 hash of the token. The actual token is only sent to the client.
  @Column({ name: 'token_hash', unique: true })
  tokenHash: string;

  @Column({ name: 'device_info', nullable: true })
  deviceInfo: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true, type: 'text' })
  userAgent: string;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt: Date;

  // Used to detect token reuse attacks (rotation chain)
  @Column({ name: 'replaced_by_token_id', type: 'uuid', nullable: true })
  replacedByTokenId: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
