# SibariFly landing form

React 19 + TypeScript application built with Vite 8 and React Compiler.

## Development

This UI now lives in the SibariFly pnpm workspace. Use Node.js 26.13.0 and
pnpm 12.18.0, pinned at the repository root. Run these commands from the root:

```sh
pnpm install --frozen-lockfile
cp apps/web/.env.sample apps/web/.env
pnpm dev:all
```

`pnpm dev:web` runs Vite alone. Open <http://localhost:3000>; `VITE_API_URL=/api`
uses the existing proxy to the API on port 8000. See the root README for API setup.
Make deployable UI changes in this workspace. Docker builds `apps/web` and the
API from the same revision, using `VITE_API_URL=/api`. UI fixes and features share
the root Release Please version and changelog with the API.

## Code quality

Biome handles linting, formatting, and import organization. Its configuration
is in `biome.json`, with lint rules migrated from the previous configuration,
including React Hooks and Fast Refresh checks. Formatting uses two spaces,
single quotes in JavaScript/TypeScript, semicolons, and optional arrow parentheses.
Biome respects `.gitignore` and excludes build output.

From `apps/web` (or use `pnpm --filter pilots-log <script>` from the root):

```sh
pnpm lint          # Check lint rules; warnings fail the check
pnpm lint:fix      # Apply safe lint fixes
pnpm format        # Format supported files
pnpm format:check  # Check formatting without modifying files
pnpm check         # Check lint, formatting, and import organization
pnpm build         # Type-check and build for production
```

Use the [Biome editor extension](https://biomejs.dev/editors/first-party-extensions/)
for editor diagnostics and formatting. Markdown and other unsupported formats are
maintained manually.

## Continuous integration

The root pull request workflow and both Cloud Build pipelines run UI lint
and `VITE_API_URL=/api pnpm build:web` alongside the API checks. Installation uses
the single root frozen lockfile. The imported nested CI workflow was consolidated
into the root workflow.

## Build tooling

React Compiler runs in development and production through
`@vitejs/plugin-react`'s `reactCompilerPreset` and `@rolldown/plugin-babel`,
following the [React Compiler Vite setup](https://react.dev/learn/react-compiler/installation#vite).
It automatically memoizes eligible components and hooks; manual `use memo`
directives are unnecessary. Keep renders pure and use reactive subscriptions
(such as React Hook Form's `useWatch`) for values that drive the UI.

Tailwind CSS 4 uses `@tailwindcss/vite`. The stylesheet explicitly loads the
existing JavaScript theme and Flowbite sources, with class-based dark mode.
Tailwind 4 requires Safari 16.4+, Chrome 111+, or Firefox 128+.

The overrides in the root `pnpm-workspace.yaml` keep transitive Rollup 4 and YAML 2
dependencies on patched versions for GHSA-mw96-cpmx-2vgc and
GHSA-48c2-rrv3-qjmp. Revisit these overrides when upstream dependencies no
longer resolve vulnerable versions.
