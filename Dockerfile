FROM node:26.13.0-slim@sha256:5adad64f9a1fca2d51972caa65983634c8a774eb300d72b20f7f2a0f60368072 AS base
RUN apt-get update && apt-get install -y openssl git
RUN npm install -g pnpm@12.18.0

FROM base AS prod-deps
COPY . /app
WORKDIR /app
RUN pnpm install --prod --frozen-lockfile

FROM base AS prisma-client
COPY . /app
WORKDIR /app
RUN pnpm install --frozen-lockfile
RUN pnpm run prisma-generate

FROM base AS build-frontend
ARG WEB_APP_BRANCH
ARG VITE_API_URL
RUN git clone --depth=1 --single-branch --branch "${WEB_APP_BRANCH}" https://github.com/edge33/sibarifly-landing-form
WORKDIR /sibarifly-landing-form
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
WORKDIR /app
COPY --from=prod-deps /app/package.json /app/package.json
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY src /app/src
COPY --from=prisma-client /app/generated /app/generated
COPY --from=build-frontend /sibarifly-landing-form/dist /app/static/

EXPOSE 8000
CMD [ "node", "src/index.ts"]
