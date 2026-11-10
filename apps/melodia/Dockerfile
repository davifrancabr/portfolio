FROM oven/bun:1.3.14 AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json bun.lock ./
COPY apps/melodia/package.json ./apps/melodia/package.json
COPY packages ./packages
RUN bun install --frozen-lockfile

FROM dependencies AS builder
COPY . .
RUN bun run build --filter=melodia

FROM oven/bun:1.3.14-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app /app
EXPOSE 3000
CMD ["bun", "run", "--cwd", "apps/melodia", "start"]
