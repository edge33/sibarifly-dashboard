FROM node:26.13.0-slim@sha256:5adad64f9a1fca2d51972caa65983634c8a774eb300d72b20f7f2a0f60368072 AS base
RUN apt-get update && apt-get install -y openssl
RUN npm install -g pnpm@12.18.0

FROM base AS prod-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm --filter sibarifly-dashboard-api install --prod --frozen-lockfile

FROM base AS build
COPY . /app
WORKDIR /app
RUN pnpm install --frozen-lockfile
RUN pnpm run prisma-generate
ARG VITE_API_URL=/api
RUN pnpm run build:web

FROM base
WORKDIR /app/apps/api
# Keep the workspace virtual store and the API links at their original paths.
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=prod-deps /app/apps/api/package.json ./package.json
COPY --from=prod-deps /app/apps/api/node_modules ./node_modules
COPY apps/api/src ./src
COPY --from=build /app/apps/api/generated ./generated
COPY --from=build /app/apps/web/dist ./static/

EXPOSE 8000
CMD [ "node", "src/index.ts"]
