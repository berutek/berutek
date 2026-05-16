import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from './entities/session.entity';

const SESSION_DURATION_DAYS = 30;

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {}

  async createSession(userId: string, ipAddress: string, userAgent: string): Promise<SessionEntity> {
    const now = new Date();
    return this.sessionRepo.save({
      userId,
      ipAddress,
      userAgent,
      lastActivityAt: now,
      expiresAt: new Date(now.getTime() + SESSION_DURATION_DAYS * 86400000),
    });
  }

  async getUserSessions(userId: string): Promise<SessionEntity[]> {
    return this.sessionRepo.find({
      where: { userId, isActive: true },
      order: { lastActivityAt: 'DESC' },
    });
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    await this.sessionRepo.update(
      { id: sessionId, userId },
      { isActive: false },
    );
  }

  async revokeAllSessions(userId: string, exceptSessionId?: string): Promise<void> {
    const query = this.sessionRepo
      .createQueryBuilder()
      .update(SessionEntity)
      .set({ isActive: false })
      .where('user_id = :userId AND is_active = true', { userId });

    if (exceptSessionId) {
      query.andWhere('id != :sessionId', { sessionId: exceptSessionId });
    }
    await query.execute();
  }
}
