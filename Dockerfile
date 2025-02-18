FROM node:20-slim AS builder

ARG NPM_REGISTRY

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DB_FILE_NAME=file:local.db

WORKDIR /app

COPY package*.json ./

RUN --mount=type=secret,id=NPM_REGISTRY \
    cat /run/secrets/NPM_REGISTRY > ~/.npmrc && \
    npm ci --ignore-scripts && \
    rm ~/.npmrc

COPY . .

RUN DB_FILE_NAME=DB_FILE_NAME npm run db 

RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

USER node

COPY --from=builder --chown=node:nodejs /app/.next/standalone ./
COPY --from=builder --chown=node:nodejs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]