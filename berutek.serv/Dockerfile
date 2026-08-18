# ---- production deps ----
FROM node:24.15.0-alpine AS prod-deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.1.3 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

# ---- all deps ----
FROM node:24.15.0-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.1.3 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- builder ----
FROM node:24.15.0-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.1.3 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ---- runner ----
FROM node:24.15.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs
COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main"]
