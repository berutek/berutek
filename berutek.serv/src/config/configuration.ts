export default () => ({
    app: {
        port: parseInt(process.env.PORT || "3000", 10),
        apiPrefix: process.env.API_PREFIX || 'api/v1',
        corsOrigin: process.env.APP_CORS_ORIGIN,
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
        issuer: process.env.JWT_ISSUER || 'berutek',
    },
    security: {
        encryptionKey: process.env.ENCRYPTION_KEY,
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5", 10),
        lockoutDuration: parseInt(process.env.LOCKOUT_DURATION_MINUTES || "15", 10),
    },
    twoFactor: {
        appName: process.env.TWO_FACTOR_APP_NAME || 'BeruTek',
    },
    session: {
        secret: process.env.SESSION_SECRET,
    },
    oidc: {
        clientId: process.env.OIDC_CLIENT_ID,
        clientSecret: process.env.OIDC_CLIENT_SECRET,
        issuerUrl: process.env.OIDC_ISSUER_URL,
        discoveryUrl: process.env.OIDC_DISCOVERY_URL,
        callbackUrl: process.env.OIDC_CALLBACK_URL,
        frontendUrl: process.env.FRONTEND_URL,
    },
    mail: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        from: process.env.SMTP_FROM,
    },
});