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

@Entity('recovery_codes')
@Index(['userId', 'isUsed'])
export class RecoveryCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  // Hashed with argon2 - never stored in plain text
  @Column({ name: 'code_hash' })
  codeHash: string;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.recoveryCodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
