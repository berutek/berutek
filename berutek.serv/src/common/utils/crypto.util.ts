import * as argon2 from "argon2";
import * as crypto from "crypto";

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

export class CryptoUtil {
    static encrypt(plaintext: string, key: string): string {
        const keyBuffer = Buffer.from(key, 'hex');
        if (keyBuffer.length !== 32) {
            throw new Error('Encryption key must be 32 bytes (64 hex chars)');
        }

        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

        const encrypted = Buffer.concat([
            cipher.update(plaintext, 'utf8'),
            cipher.final(),
        ]);

        // Format: iv:ciphertext (both base64)
        return [
            iv.toString('base64'),
            encrypted.toString('base64'),
        ].join(':');
    }

    static decrypt(ciphertext: string, key: string): string {
        const keyBuffer = Buffer.from(key, 'hex');
        const [ivB64, encryptedB64] = ciphertext.split(':');

        const iv = Buffer.from(ivB64, 'base64');
        const encrypted = Buffer.from(encryptedB64, 'base64');

        const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);

        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);

        return decrypted.toString('utf8');
    }

    static async hashPassword(password: string): Promise<string> {
        return argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 1,
        });
    }

    static async verifyPassword(hash: string, password: string): Promise<boolean> {
        try {
            return await argon2.verify(hash, password);
        } catch {
            return false;
        }
    }

    static hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    static generateSecureToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    static generateRecoveryCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const segment: string[] = []

        for (let i = 0; i < 3; i++) {
            let segmentStr = '';
            for (let j = 0; j < 4; j++) {
                const idx = crypto.randomInt(0, chars.length);
                segmentStr += chars[idx];
            }
            segment.push(segmentStr);
        }
        return segment.join('-');
    }

    static safeCompare(a: string, b: string): boolean {
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    }
}