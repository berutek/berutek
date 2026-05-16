import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly refreshExpirationMs: number;

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.refreshExpirationMs = this.parseDuration(
      configService.get<string>('jwt.refreshExpiration')!,
    );
  }

  async issueTokens(user: User, ipAddress: string, userAgent: string): Promise<TokenPair> {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = CryptoUtil.generateSecureToken(48);
    const tokenHash = CryptoUtil.hashToken(refreshToken);

    await this.refreshTokenRepo.save({
      userId: user.id,
      tokenHash,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + this.refreshExpirationMs),
    });

    return { accessToken, refreshToken };
  }

  async validateRefreshToken(
    token: string,
  ): Promise<{ user: User; tokenRecord: RefreshTokenEntity }> {
    const tokenHash = CryptoUtil.hashToken(token);
    const tokenRecord = await this.refreshTokenRepo.findOne({
      where: { tokenHash },
      relations: ['user', 'user.roles', 'user.roles.permissions'],
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.isRevoked) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    if (tokenRecord.user.isDeleted) {
      throw new UnauthorizedException('Account inactive');
    }

    return { user: tokenRecord.user, tokenRecord };
  }

  /**
   * Rotate refresh token atomically: revoke old, issue new, link them.
   * The link (replacedByTokenId) enables reuse detection.
   */
  async rotateRefreshToken(
    oldToken: RefreshTokenEntity,
    user: User,
    ipAddress: string,
    userAgent: string,
  ): Promise<TokenPair> {
    return this.dataSource.transaction(async (manager) => {
      const newRefreshToken = CryptoUtil.generateSecureToken(48);
      const newTokenHash = CryptoUtil.hashToken(newRefreshToken);

      const newTokenRecord = await manager.save(RefreshTokenEntity, {
        userId: user.id,
        tokenHash: newTokenHash,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + this.refreshExpirationMs),
      });

      await manager.update(RefreshTokenEntity, oldToken.id, {
        isRevoked: true,
        revokedAt: new Date(),
        replacedByTokenId: newTokenRecord.id,
      });

      const accessToken = await this.signAccessToken(user);
      return { accessToken, refreshToken: newRefreshToken };
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const tokenHash = CryptoUtil.hashToken(token);
    await this.refreshTokenRepo.update(
      { tokenHash },
      { isRevoked: true, revokedAt: new Date() },
    );
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepo.update(
      { userId, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() },
    );
  }

  /**
   * Short-lived (5 min) token issued after password verification when 2FA is required.
   * Cannot be used to access protected resources.
   */
  async generate2faChallengeToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, purpose: '2fa_challenge' },
      {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: '5m',
      },
    );
  }

  async verify2faChallengeToken(token: string): Promise<{ sub: string } | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.accessSecret'),
      });
      if (payload.purpose !== '2fa_challenge') return null;
      return payload;
    } catch {
      return null;
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    const result = await this.refreshTokenRepo.delete({
      expiresAt: LessThan(new Date()),
    });
    this.logger.log(`Cleaned up ${result.affected} expired tokens`);
  }

  private async signAccessToken(user: User): Promise<string> {
    const roles = user.roles?.map((r) => r.name) ?? [];
    const permissions =
      user.roles?.flatMap((r) => r.permissions?.map((p) => p.name) ?? []) ?? [];

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles,
      permissions: [...new Set(permissions)],
    };

    return this.jwtService.signAsync(payload);
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const [, num, unit] = match;
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return parseInt(num) * multipliers[unit];
  }
}
