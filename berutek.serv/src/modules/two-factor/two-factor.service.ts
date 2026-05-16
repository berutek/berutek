import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { generateSecret, generateURI, verifySync } from 'otplib';
import * as QRCode from 'qrcode';
import { User } from '../users/entities/user.entity';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { TwoFactorAuth, TwoFactorMethod } from './entities/two-factor.entity';
import { RecoveryCode } from './entities/recovery-code.entity';

const RECOVERY_CODE_COUNT = 10;

@Injectable()
export class TwoFactorService {
  private readonly appName: string;
  private readonly encryptionKey: string;

  constructor(
    @InjectRepository(TwoFactorAuth)
    private readonly twoFactorRepo: Repository<TwoFactorAuth>,
    @InjectRepository(RecoveryCode)
    private readonly recoveryRepo: Repository<RecoveryCode>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.appName = configService.get<string>('twoFactor.appName')!;
    this.encryptionKey = configService.get<string>('security.encryptionKey')!;

  }

  /**
   * Step 1: Generate a new TOTP secret and QR code.
   * Returns the QR code as a data URL. The user must scan it and verify
   * with a code before 2FA is actually enabled (call enable2fa next).
   */
  async generate2faSetup(userId: string): Promise<{ qrCode: string; secret: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.is2faEnabled) {
      throw new ConflictException('2FA is already enabled. Disable it first to regenerate.');
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({ issuer: this.appName, label: user.email, secret });
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    // Save the encrypted secret as unverified. It will be marked verified
    // once the user submits a valid code to confirm setup.
    const encryptedSecret = CryptoUtil.encrypt(secret, this.encryptionKey);

    await this.twoFactorRepo.upsert(
      {
        userId,
        secretEncrypted: encryptedSecret,
        method: TwoFactorMethod.TOTP,
        isVerified: false,
      },
      ['userId'],
    );

    return { qrCode, secret };
  }

  /**
   * Step 2: Verify the user can read codes from their authenticator app,
   * then enable 2FA on the account and generate recovery codes.
   */
  async enable2fa(userId: string, code: string): Promise<{ recoveryCodes: string[] }> {
    const twoFactor = await this.twoFactorRepo.findOne({ where: { userId } });
    if (!twoFactor) throw new NotFoundException('2FA setup not initiated');

    const secret = CryptoUtil.decrypt(twoFactor.secretEncrypted, this.encryptionKey);
    const isValid = verifySync({ token: code, secret, epochTolerance: 30 }).valid;
    if (!isValid) throw new BadRequestException('Invalid verification code');

    return this.dataSource.transaction(async (manager) => {
      await manager.update(TwoFactorAuth, twoFactor.id, {
        isVerified: true,
        verifiedAt: new Date(),
      });
      await manager.update(User, userId, { is2faEnabled: true });

      // Generate 10 recovery codes. The plaintext is shown ONCE to the user.
      const plainCodes: string[] = [];
      const hashedCodes: Partial<RecoveryCode>[] = [];

      for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
        const code = CryptoUtil.generateRecoveryCode();
        plainCodes.push(code);
        hashedCodes.push({
          userId,
          codeHash: await CryptoUtil.hashPassword(code),
        });
      }

      await manager.save(RecoveryCode, hashedCodes);
      return { recoveryCodes: plainCodes };
    });
  }

  async disable2fa(userId: string, password: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await CryptoUtil.verifyPassword(user.passwordHash, password);
    if (!isValid) throw new BadRequestException('Invalid password');

    await this.dataSource.transaction(async (manager) => {
      await manager.update(User, userId, { is2faEnabled: false });
      await manager.delete(TwoFactorAuth, { userId });
      await manager.delete(RecoveryCode, { userId });
    });
  }

  async verifyTotp(user: User, code: string): Promise<boolean> {
    const twoFactor = user.twoFactorAuth
      ?? (await this.twoFactorRepo.findOne({ where: { userId: user.id } }));
    if (!twoFactor || !twoFactor.isVerified) return false;

    const secret = CryptoUtil.decrypt(twoFactor.secretEncrypted, this.encryptionKey);
    return verifySync({ token: code, secret, epochTolerance: 30 }).valid;
  }

  /**
   * Recovery codes are single-use. We hash each one (argon2) and compare
   * against unused codes. On match, mark it used in a transaction.
   */
  async verifyRecoveryCode(userId: string, code: string): Promise<boolean> {
    const unusedCodes = await this.recoveryRepo.find({
      where: { userId, isUsed: false },
    });

    for (const stored of unusedCodes) {
      const matches = await CryptoUtil.verifyPassword(stored.codeHash, code);
      if (matches) {
        await this.recoveryRepo.update(stored.id, {
          isUsed: true,
          usedAt: new Date(),
        });
        return true;
      }
    }
    return false;
  }

  async regenerateRecoveryCodes(userId: string, password: string): Promise<string[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await CryptoUtil.verifyPassword(user.passwordHash, password);
    if (!isValid) throw new BadRequestException('Invalid password');

    return this.dataSource.transaction(async (manager) => {
      await manager.delete(RecoveryCode, { userId });

      const plainCodes: string[] = [];
      const hashedCodes: Partial<RecoveryCode>[] = [];

      for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
        const code = CryptoUtil.generateRecoveryCode();
        plainCodes.push(code);
        hashedCodes.push({
          userId,
          codeHash: await CryptoUtil.hashPassword(code),
        });
      }

      await manager.save(RecoveryCode, hashedCodes);
      return plainCodes;
    });
  }
}
