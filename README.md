# SibariFly-dashboard

A flight log for SibariFly: pilots record aircraft arrivals and departures, and
administrators sign in to view and manage flight records.

- `apps/web`: React and TypeScript frontend, built with Vite.
- `apps/api`: Fastify API with JWT authentication and PostgreSQL via Prisma.

Both apps share a pnpm workspace and ship in one container, with the API serving
the built frontend.

## Local development

Use Node `26.13.0` (`.nvmrc`) and pnpm `12.18.0` (`package.json`). Run commands
from the repository root.

```sh
pnpm install --frozen-lockfile
cp apps/api/.env.sample apps/api/.env
cp apps/web/.env.sample apps/web/.env
```

Configure the API environment file with your PostgreSQL connection, JWT secrets,
and admin password. To start a local database, use
`docker compose -f docker-compose-test.yml up -d db`.

```sh
pnpm prisma-generate
pnpm prisma-migrate
pnpm dev:all
```

Open <http://localhost:3000>. The UI uses `VITE_API_URL=/api` and proxies API
requests to port 8000. API documentation is available at
<http://localhost:8000/docs/> in development.

## Commands

```sh
pnpm dev              # API only
pnpm dev:web          # Frontend only
pnpm lint             # Check both apps
pnpm typecheck        # API typecheck
pnpm test:coverage    # API tests (loads apps/api/.env.test)
pnpm build:web        # Frontend typecheck and production build
```

## Container

```sh
docker build -t sibarifly-dashboard .
docker run --rm -p 8000:8000 --env-file apps/api/.env \
  -e ENVIRONMENT=production sibarifly-dashboard
```

Use a database URL reachable from the container. The image builds the frontend
with `VITE_API_URL=/api`; apply database migrations separately with
`pnpm prisma-migrate` before starting it.
