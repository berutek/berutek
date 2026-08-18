import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity, AuditAction } from './entities/audit-log.entity';

interface AuditLogData {
  userId?: string;
  action: AuditAction;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditRepo: Repository<AuditLogEntity>,
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

}
