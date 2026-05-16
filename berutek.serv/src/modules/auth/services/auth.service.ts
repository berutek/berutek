import {
    Injectable,
    ConflictException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { CryptoUtil } from '../../../common/utils/crypto.util';
import { AuditAction } from '../../audit/entities/audit-log.entity';
import { LoginDto } from '../dto/login.dto';
import { IAuthResponse, TwoFactorChallenge } from '../interfaces/auth-response.interface';
import { LoginFailureReason } from '../../audit/entities/login-attempt.entity';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized.exception';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../tokens/token.service';
import { AuditService } from '../../audit/audit.service';
import { TwoFactorService } from '../../two-factor/two-factor.service';
import { SessionService } from '../../session/session.service';
import { Verify2faDto } from '../dto/verify-2fa.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly maxLoginAttempts: number;
    private readonly lockoutDuration: number;

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
        private readonly twoFactorService: TwoFactorService,
        private readonly auditService: AuditService,
        private readonly sessionService: SessionService,
    ) {
        this.maxLoginAttempts = configService.get<number>('security.maxLoginAttempts')!;
        this.lockoutDuration = configService.get<number>('security.lockoutDuration')!;
    }

    async register(dto: RegisterDto, ipAddress: string, userAgent: string): Promise<{ userId: string }> {
        const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
        if (existing) {
            // Don't reveal whether email exists - return generic message instead
            throw new ConflictException('Registration failed. Please try again.');
        }

        const passwordHash = await CryptoUtil.hashPassword(dto.password);

        const user = await this.dataSource.transaction(async (manager) => {
            const newUser = manager.create(User, {
                email: dto.email.toLowerCase(),
                passwordHash,
                name: dto.name,
                passwordChangedAt: new Date(),
            });
            return manager.save(newUser);
        });

        await this.auditService.log({
            userId: user.id,
            action: AuditAction.USER_REGISTERED,
            ipAddress,
            userAgent,
            metadata: { email: user.email },
        });

        // TODO: send email verification token (out of scope for this base)
        return { userId: user.id };
    }

    /**
     * Step 1 of login: validate credentials.
     * If 2FA is enabled, return a challenge token instead of full access tokens.
     */
    async login(dto: LoginDto, ipAddress: string, userAgent: string): Promise<IAuthResponse | TwoFactorChallenge> {
        const user = await this.userRepo.findOne({
            where: { email: dto.email.toLowerCase() },
            relations: ['roles', 'roles.permissions'],
        });

        if (!user) {
            await this.auditService.recordLoginAttempt({
                emailAttempted: dto.email,
                ipAddress,
                userAgent,
                success: false,
                failureReason: LoginFailureReason.USER_NOT_FOUND,
                attemptedAt: new Date(),
            });
            console.log("NO existe")
            // Use same response shape to prevent user enumeration
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.isDeleted) {
            await this.recordFailedAttempt(user, ipAddress, userAgent, LoginFailureReason.ACCOUNT_DISABLED);
            throw new UnauthorizedException('Invalid credentials');
        }

        if (this.isAccountLocked(user)) {
            await this.recordFailedAttempt(user, ipAddress, userAgent, LoginFailureReason.ACCOUNT_LOCKED);
            throw new ForbiddenException('Account temporarily locked. Try again later.');
        }

        const isPasswordValid = await CryptoUtil.verifyPassword(user.passwordHash, dto.password);
        if (!isPasswordValid) {
            await this.handleFailedLogin(user, ipAddress, userAgent);
            throw new UnauthorizedException('Invalid credentials');
        }

        // Reset failed attempts on successful password validation
        await this.userRepo.update(user.id, {
            failedLoginAttempts: 0,
            lockedUntil: null,
        });

        // If 2FA enabled, issue a short-lived challenge token instead of full tokens
        if (user.is2faEnabled) {
            const challengeToken = await this.tokenService.generate2faChallengeToken(user.id);
            return {
                requires2fa: true,
                challengeToken,
                method: 'totp',
            };
        }

        return this.completeLogin(user, ipAddress, userAgent);
    }

    /**
     * Step 2 of login: verify 2FA code and issue full tokens.
     */
    async verify2fa(dto: Verify2faDto, ipAddress: string, userAgent: string): Promise<IAuthResponse> {
        const payload = await this.tokenService.verify2faChallengeToken(dto.challengeToken);
        if (!payload) {
            throw new UnauthorizedException('Invalid or expired challenge');
        }

        const user = await this.userRepo.findOne({
            where: { id: payload.sub },
            relations: ['roles', 'roles.permissions', 'twoFactorAuth'],
        });

        if (!user || !user.is2faEnabled) {
            throw new UnauthorizedException('Invalid challenge');
        }

        const isValid = dto.isRecoveryCode
            ? await this.twoFactorService.verifyRecoveryCode(user.id, dto.code)
            : await this.twoFactorService.verifyTotp(user, dto.code);

        if (!isValid) {
            await this.recordFailedAttempt(user, ipAddress, userAgent, LoginFailureReason.INVALID_2FA);
            throw new UnauthorizedException('Invalid 2FA code');
        }

        if (dto.isRecoveryCode) {
            await this.auditService.log({
                userId: user.id,
                action: AuditAction.RECOVERY_CODE_USED,
                ipAddress,
                userAgent,
            });
        }

        return this.completeLogin(user, ipAddress, userAgent);
    }

    async logout(userId: string, refreshToken: string, ipAddress: string): Promise<void> {
        await this.tokenService.revokeRefreshToken(refreshToken);
        await this.auditService.log({
            userId,
            action: AuditAction.USER_LOGGED_OUT,
            ipAddress,
        });
    }

    /**
     * Token rotation with reuse detection.
     * If a previously rotated token is used again, ALL user tokens are revoked.
     */
    async refreshTokens(refreshToken: string, ipAddress: string, userAgent: string): Promise<IAuthResponse> {
        const { user, tokenRecord } = await this.tokenService.validateRefreshToken(refreshToken);

        // Detect reuse: token was already replaced
        if (tokenRecord.replacedByTokenId) {
            this.logger.warn(`Token reuse detected for user ${user.id}`);
            await this.tokenService.revokeAllUserTokens(user.id);
            await this.auditService.log({
                userId: user.id,
                action: AuditAction.TOKEN_REUSED,
                ipAddress,
                userAgent,
            });
            throw new UnauthorizedException('Token reuse detected. All sessions revoked.');
        }

        const newTokens = await this.tokenService.rotateRefreshToken(
            tokenRecord,
            user,
            ipAddress,
            userAgent,
        );

        return {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            user: this.sanitizeUser(user),
        };
    }

    private async completeLogin(user: User, ipAddress: string, userAgent: string): Promise<IAuthResponse> {
        const tokens = await this.tokenService.issueTokens(user, ipAddress, userAgent);

        await this.sessionService.createSession(user.id, ipAddress, userAgent);

        await this.userRepo.update(user.id, { lastLoginAt: new Date() });

        await this.auditService.recordLoginAttempt({
            userId: user.id,
            emailAttempted: user.email,
            ipAddress,
            userAgent,
            success: true,
            attemptedAt: new Date(),
        });

        await this.auditService.log({
            userId: user.id,
            action: AuditAction.USER_LOGGED_IN,
            ipAddress,
            userAgent,
        });

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: this.sanitizeUser(user),
        };
    }

    //this function handles failed login attempts, increments the counter, and locks the account if max attempts are exceeded
    private async handleFailedLogin(user: User, ipAddress: string, userAgent: string): Promise<void> {
        const failedAttempts = user.failedLoginAttempts + 1;
        const updates: Partial<User> = { failedLoginAttempts: failedAttempts };

        if (failedAttempts >= this.maxLoginAttempts) {
            updates.lockedUntil = new Date(Date.now() + this.lockoutDuration * 60 * 1000);
            await this.auditService.log({
                userId: user.id,
                action: AuditAction.ACCOUNT_LOCKED,
                ipAddress,
                userAgent,
                metadata: { failedAttempts },
            });
        }

        await this.userRepo.update(user.id, updates);
        await this.recordFailedAttempt(user, ipAddress, userAgent, LoginFailureReason.INVALID_CREDENTIALS);
    }

    //this function is used to log failed 2FA attempts and account lockouts without revealing which step failed to the user
    private async recordFailedAttempt(
        user: User,
        ipAddress: string,
        userAgent: string,
        reason: LoginFailureReason,
    ): Promise<void> {
        await this.auditService.recordLoginAttempt({
            userId: user.id,
            emailAttempted: user.email,
            ipAddress,
            userAgent,
            success: false,
            failureReason: reason,
            attemptedAt: new Date(),
        });
    }

    private isAccountLocked(user: User): boolean {
        return user.lockedUntil !== null && user.lockedUntil > new Date();
    }

    private sanitizeUser(user: User) {
        const { passwordHash, ...rest } = user;
        return rest;
    }
}
