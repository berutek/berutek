import { User } from "../entities/user.entity";

export interface IUser {
    id: string;
    name: string;
    email: string;
    failedLoginAttempts: number;
    lockedUntil: Date | null;
    lastLoginAt: Date | null;
    passwordChangedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    isEmailVerified: boolean;
    is2faEnabled: boolean;
    isDeleted: boolean;
}
