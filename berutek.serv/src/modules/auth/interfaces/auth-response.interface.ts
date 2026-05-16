export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    user: Record<string, any>;
}
export interface TwoFactorChallenge{
    requires2fa: true;
    challengeToken: string;
    method: "totp" | "email" | "sms";
}