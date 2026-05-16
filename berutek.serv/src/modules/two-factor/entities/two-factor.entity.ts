import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TwoFactorMethod {
  TOTP = 'totp',
  EMAIL = 'email',
  SMS = 'sms',
}

@Entity('two_factor_auth')
export class TwoFactorAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  // Encrypted using AES-256-GCM, never stored in plain text
  @Column({ name: 'secret_encrypted' })
  secretEncrypted: string;

  @Column({
    type: 'enum',
    enum: TwoFactorMethod,
    default: TwoFactorMethod.TOTP,
  })
  method: TwoFactorMethod;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.twoFactorAuth, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
