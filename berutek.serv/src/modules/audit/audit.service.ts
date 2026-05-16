import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity, AuditAction } from './entities/audit-log.entity';
import { LoginAttemptEntity, LoginFailureReason } from './entities/login-attempt.entity';

interface AuditLogData {
  userId?: string;
  action: AuditAction;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

interface LoginAttemptData {
  userId?: string;
  emailAttempted: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  attemptedAt?: Date;
  failureReason?: LoginFailureReason;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditRepo: Repository<AuditLogEntity>,
    @InjectRepository(LoginAttemptEntity)
    private readonly loginAttemptRepo: Repository<LoginAttemptEntity>,
  ) {}

  async log(data: AuditLogData): Promise<void> {
    // Fire-and-forget - never block the auth flow on audit failures.
    // In production, route through a queue (BullMQ) for higher throughput.
    await this.auditRepo.save({
      userId: data.userId,
      action: data.action,
      metadata: data.metadata,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });
  }

  async recordLoginAttempt(data: LoginAttemptData): Promise<void> {
    await this.loginAttemptRepo.save({
      userId: data.userId,
      emailAttempted: data.emailAttempted,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      success: data.success,
      failureReason: data.failureReason,
      attemptedAt: data.attemptedAt,
    });
  }
}
