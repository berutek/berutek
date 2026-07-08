# berutek.serv

Backend API for the **BeruTek** ecosystem, a platform built to manage customers, automate security-sensitive workflows, and integrate intelligent automation pipelines. Built with NestJS and designed for high security standards from the ground up.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS v11 + TypeScript v5.7 |
| Database | PostgreSQL + TypeORM v0.3 |
| Auth | JWT (access & refresh), Passport.js |
| Password hashing | Argon2 |
| 2FA | TOTP via `otplib` + QR code generation |
| Validation | Zod + class-validator |
| Security headers | Helmet |
| Rate limiting | `@nestjs/throttler` (3-tier) |
| Testing | Jest + Supertest |

---

## Project Structure

```
src/
├── common/
│   ├── decorators/        # @Public, @CurrentUser, @Roles
│   ├── exceptions/        # Custom HTTP exceptions + global filter
│   ├── middleware/        # HTTP request logger
│   ├── pipes/             # ZodValidationPipe
│   └── utils/             # Crypto helpers
├── config/                # App, database, and JWT config factories
├── database/
│   ├── migrations/
│   └── seeds/
└── modules/
    ├── audit/             # Login attempt tracking + audit logs
    ├── auth/              # Authentication & 2FA
    ├── customers/         # Customer management
    ├── reviews/           # Customer reviews
    ├── roles/             # RBAC roles & permissions
    ├── session/           # Active session management
    ├── tokens/            # Refresh token rotation
    ├── two-factor/        # TOTP setup, recovery codes
    └── users/             # User management
```

---

## Modules

### Auth
Full authentication lifecycle with JWT access/refresh token rotation.

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register a new user |
| `POST` | `/api/v1/auth/login` | Public | Login (returns tokens or 2FA challenge) |
| `POST` | `/api/v1/auth/refresh` | Public | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | JWT | Invalidate session & refresh token |
| `GET` | `/api/v1/auth/me` | JWT | Get current user from token |
| `POST` | `/api/v1/auth/2fa/setup` | JWT | Generate TOTP secret + QR code |
| `POST` | `/api/v1/auth/2fa/enable` | JWT | Enable 2FA after verifying TOTP code |
| `POST` | `/api/v1/auth/2fa/disable` | JWT | Disable 2FA (requires password) |
| `POST` | `/api/v1/auth/2fa/verify` | Public | Complete 2FA login challenge |
| `POST` | `/api/v1/auth/2fa/recovery-codes/regenerate` | JWT | Regenerate recovery codes |

### Customers
Full CRUD for customer records. Supports individual and company profiles.

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/v1/customers` | List all customers |
| `GET` | `/api/v1/customers/:id` | Get a single customer |
| `POST` | `/api/v1/customers` | Create a customer |
| `PUT` | `/api/v1/customers/:id` | Update a customer |
| `DELETE` | `/api/v1/customers/:id` | Soft-delete a customer |

### Users
Internal user management with role-based access control (RBAC). Users carry roles linked to granular permissions.

### Reviews
Customer-linked review records. Each customer can have an associated review entry.

### Audit & Sessions
Every login attempt (success or failure) is persisted to `login_attempts`. All significant actions are recorded in `audit_logs`. Active sessions are tracked per device/IP for revocation support.

---

## Security Architecture

- **Argon2** password hashing, no plain-text or MD5/bcrypt shortcuts.
- **JWT rotation**, short-lived access tokens (default `15m`) with refresh token rotation (default `7d`). Refresh tokens are stored hashed and invalidated on use.
- **TOTP 2FA**, HMAC-based one-time passwords via `otplib`. QR code provisioning URI returned on setup. Encrypted recovery codes regenerable on demand.
- **Account lockout**, configurable max failed attempts (default `5`) triggers a timed lockout (default `15m`), tracked per user.
- **Rate limiting**, three throttle tiers applied globally:
  - `short`: 10 req / 1s
  - `medium`: 60 req / 1 min
  - `long`: 1000 req / 1 hr
  - Auth endpoints additionally capped at 5 req / 1 min.
- **Helmet**, sets secure HTTP headers on every response.
- **CORS**, origin, methods, and headers controlled via environment config.
- **RBAC**, role & permission entities with a `user_roles` join table. `@Roles` decorator + `RolesGuard` enforced at the controller level.
- **Global JWT guard**, every route is protected by default; opt-out with `@Public()`.

---

## Environment Variables

Create a `.env` file at the root of `berutek.serv/`:

```env
# App
PORT=3000
API_PREFIX=api/v1
APP_CORS_ORIGIN=http://localhost:4000

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=berutek
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=7d
JWT_ISSUER=berutek

# Security
ENCRYPTION_KEY=your_32_byte_hex_key
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15

# Two-Factor Auth
TWO_FACTOR_APP_NAME=BeruTek

# Mail (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=yoursmtppassword
SMTP_FROM=noreply@berutek.dev
```

---

## Getting Started

**Prerequisites:** Node.js ≥ 20, PostgreSQL ≥ 15.

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start with hot-reload |
| `npm run start:debug` | Start in debug + watch mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Run compiled build |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint & auto-fix with ESLint |
| `npm run format` | Format with Prettier |

---

## Coming Soon

- **n8n integration**, automated workflow triggers for customer lifecycle events, security alerts, and approval pipelines.
- **Notifications module**, email & in-app notification dispatch powered by SMTP config already wired in.
- **Advanced RBAC**, permission inheritance and scoped resource access.
- **More ecosystem modules**, expanding the BeruTek platform beyond customer management.
