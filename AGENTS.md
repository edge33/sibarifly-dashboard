# Project guidance

## Purpose and layout

SibariFly-dashboard records aircraft arrivals and departures and provides an
admin interface for managing flight records. This is a pnpm workspace:

- `apps/api`: Fastify 5 API, TypeScript, PostgreSQL and Prisma. Routes and plugins
  live in `src/routes` and `src/plugins`; API routes use the `/api` prefix.
- `apps/web`: React 19 frontend with Vite, React Compiler and Tailwind CSS 4.
  Pages, shared components and authentication state live under `src`.
- The root owns the lockfile, shared tooling, Docker image and release stream.

Keep changes focused and simple. Follow nearby code, reuse existing dependencies
and avoid unrelated formatting, abstractions or dependency upgrades.

## Toolchain and commands

Use the Node version in `.nvmrc` and pnpm version in root `package.json`.
Install dependencies from the repository root with `pnpm install --frozen-lockfile`.
Use pnpm for dependency changes and commit the resulting root lockfile; do not
introduce app-level lockfiles or another package manager.

Run these commands from the root:

```sh
pnpm prisma-generate  # Generate the API's Prisma client
pnpm dev:all          # API on port 8000 and Vite on port 3000
pnpm dev              # API only
pnpm dev:web          # Frontend only
pnpm lint             # Repository and both apps, using their Biome configurations
pnpm typecheck        # API types, including prisma.config.ts
pnpm test:coverage    # API tests with Node's test runner
pnpm build:web        # Frontend typecheck and Vite production build
pnpm prisma-migrate   # Apply committed migrations to the configured database
```

## Implementation conventions

- Use TypeScript and ESM. The API runs TypeScript directly through Node's type
  stripping; preserve explicit `.ts` imports and avoid syntax requiring emission.
- Keep Fastify request validation and authorization on the server. Follow the
  existing TypeBox schemas, plugin registration and error-handling patterns.
- Keep React renders pure and respect Hook rules. Preserve the frontend's own
  Biome settings; do not apply API formatting conventions over frontend files.
- Environment files belong to each app. API development loads `apps/api/.env`;
  tests load `apps/api/.env.test`. Never commit real credentials or log secrets.
- Prisma config uses Node's native environment-file loading. A missing `.env`
  must remain valid for container builds and externally supplied deployment
  variables. Preserve `DIRECT_URL` preference over `DATABASE_URL`.
- Edit `apps/api/prisma/schema.prisma` and add migrations when changing the
  database schema. Do not rewrite previously applied migrations or edit generated
  Prisma files. Run migrations against a disposable local database for validation.

## Packaging and verification

Docker builds both apps from this workspace and serves `apps/web/dist` through
API static files. Preserve `VITE_API_URL=/api`, workspace dependency links and
runtime Prisma client packaging. Do not commit build output or fetch UI source
from the retired external repository.

Run checks appropriate to the change. For API changes, use lint, typecheck and
existing API tests; for frontend changes, use lint and `pnpm build:web`. Use the
existing test runner for meaningful behavior checks rather than adding a test
framework. For dependency, Prisma or Docker changes, also verify frozen install,
client generation and the relevant container/migration behavior. Review the final
diff and report checks actually run, their results and any remaining blockers.

Release Please manages the root changelog and synchronized root/API/UI versions.
Use Conventional Commit messages and PR titles (`fix:` for patches, `feat:` for
minor releases); do not bump versions manually for ordinary changes.
