FROM node:20-slim AS builder

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DB_FILE_NAME=file:/app/data/local.db

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run db 

RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs --ingroup nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]