import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionData, Store } from 'express-session';
import { Session as SessionEntity } from '../entities/session.entity';

@Injectable()
export class SessionStore extends Store {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {
    super();
  }

  /**
   * Get session by ID
   */
  async get(
    sid: string,
    callback: (err: any, session?: SessionData | null) => void,
  ) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { id: sid },
      });

      if (!session) {
        return callback(null, null);
      }

      // Check if session expired
      if (session.expiredAt < Date.now()) {
        await this.sessionRepository.remove(session);
        return callback(null, null);
      }

      const data = JSON.parse(session.json);
      callback(null, data);
    } catch (error) {
      callback(error);
    }
  }

  /**
   * Set/create session
   */
  async set(
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void,
  ) {
    try {
      const ttl = session.cookie.maxAge || 86400000; // Default 24 hours
      const expiredAt = Date.now() + ttl;

      // Delete old session if exists
      await this.sessionRepository.delete({ id: sid });

      // Create new session
      await this.sessionRepository.insert({
        id: sid,
        json: JSON.stringify(session),
        expiredAt,
      });

      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  /**
   * Delete session
   */
  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      await this.sessionRepository.delete({ id: sid });
      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  /**
   * Get session count
   */
  async length(callback: (err: any, length?: number) => void) {
    try {
      const count = await this.sessionRepository.count();
      callback(null, count);
    } catch (error) {
      callback(error);
    }
  }

  /**
   * Clear all sessions
   */
  async clear(callback?: (err?: any) => void) {
    try {
      await this.sessionRepository.clear();
      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions() {
    try {
      const result = await this.sessionRepository.delete({
        expiredAt: { $lt: Date.now() },
      } as any);

      await this.sessionRepository.query(
        'DELETE FROM sessions WHERE expired_at < $1',
        [Date.now()],
      );

    } catch (error) {
      console.error('Error cleaning sessions:', error);
    }
  }
}