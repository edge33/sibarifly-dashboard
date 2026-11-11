# Monorepo migration tracker

Status: PR 1 implemented; draft PR #91 open, local and hosted checks passed. Post-merge verification pending.

## Objective and agreed decisions

Bring `https://github.com/edge33/sibarifly-landing-form` into this repository while
preserving original Git history. Use plain pnpm workspaces with `apps/api` and
`apps/web`, without Turbo or Nx. Keep one container and one application release
stream.

Deliver three sequential, independently deployable PRs:

| PR  | Scope                                                    | UI used in deployed images                                                        |
| --- | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1   | Move API into workspace; adapt all affected tooling      | Existing external UI repository: `develop` for development, `main` for production |
| 2   | Import UI history and integrate workspace/local checks   | Existing external UI repository, with the same branch selection                   |
| 3   | Reconcile UI changes and switch image builds to local UI | `apps/web` from the same monorepo revision as the API                             |

Building API and UI from the same commit is the final state, not a requirement
for PRs 1 and 2. Do not change deployment source selection before PR 3.

## Instructions for the implementing agent

- Read repository instructions and relevant skills before implementation.
- Create a dedicated branch for each PR from the latest merged `origin/main`.
  Preserve unrelated changes and do not combine all phases in one PR.
- Complete phases in order. Verify each PR before recommending merge and record
  development deployment results before proceeding to the next phase.
- Include path fixes, CI, Docker, migrations, release tooling, and documentation
  needed by each change in the same PR. Do not merge a file move that breaks them.
- Keep mechanical moves, source import, and integration changes in separate
  commits within their respective PRs to make review easier.
- PR 2 must use a merge commit. Never squash the subtree import or rewrite the
  original UI commits. Any later PR that imports additional UI ancestry must
  also preserve that ancestry through a merge commit.
- Avoid shared libraries, behavior changes, dependency upgrades, and unrelated
  formatting churn. Preserve existing application-specific configurations.
- Update checkboxes and the progress log with exact commands, results, commit
  SHAs, PR links, and unresolved work. Never mark unexecuted checks as passing.
- This tracker does not independently authorize merges, deployments, repository
  settings changes, or archiving. Follow the user's authorization for external
  actions and record any owner actions still needed.

## Inspection baseline (refresh before each relevant phase)

At initial inspection:

- API worktree: `/home/edge33/dev/sibarifly-dashboard-api`, branch `main`, clean
  before creation of this tracker, one commit behind the recorded `origin/main`.
- UI `main`: `60f8bea84cf32e04149abe8add9afd0d0737c45d`.
- UI `develop`: `5b91dcab49677e4af0c9f62ff9da6cefc0f47fa1`, an ancestor of
  `main` with no unique commits at inspection time.
- Both apps use Node `26.13.0`. API uses pnpm `12.18.0`; UI uses `12.15.0`.
  Use API toolchain pins unless newer repository instructions supersede them.
- Cloud Build deploys `main` to development and stable `vX.Y.Z` tags to
  production. Docker fetches external UI `develop` and `main`, respectively.
- Release Please manages the root version/changelog. API exposes a package
  version through OpenAPI. Preserve release continuity throughout the migration.
- API has lint, typecheck, test, and coverage scripts; UI has lint/build CI and
  no test script.

## PR 1: API workspace structure, external UI unchanged

- [x] Refresh status, instructions, remote state, open release work, and delivery
  configuration; record the API baseline and create the PR branch.
- [x] Back up API refs and record the recovery location before structural work.
- [x] Move API source, Prisma schema/migrations/config, application manifest,
  TypeScript config, relevant static assets, and environment examples to
  `apps/api`. Use `git mv` for tracked files in a mechanical move commit.
- [x] Keep workflows, Docker/Cloud Build files, release configuration, changelog,
  and repository documentation at the root.
- [x] Create a private root package and root workspace containing `apps/*`.
  Retain the pinned toolchain and API build permissions, with runtime dependencies
  declared in `apps/api` and one root lockfile.
- [x] Provide root forwarding scripts for existing API development, lint,
  formatting, typecheck, test/coverage, Prisma generation, and migration commands.
- [x] Fix environment loading, generated-client paths, static asset paths,
  ignore patterns, editor paths, and other references affected by the move.
- [x] Scope API lint/typecheck to the intended files and verify dependencies are
  explicitly declared rather than accidentally resolved from the workspace root.
- [x] Adapt Docker's API stages and runtime layout to the workspace. Package
  production dependencies with intact pnpm links and verify Prisma generation.
- [x] Keep the external UI Docker stage, `WEB_APP_BRANCH`, branch selection,
  `VITE_API_URL=/api`, and its existing installation behavior intact.
- [x] Update both Cloud Build pipelines, GitHub checks, Makefile, and migration
  working directories. Preserve image names, labels, and deployment by digest.
- [x] Keep one root release version/changelog and configure Release Please to
  synchronize API version metadata. Preview the release change and check that
  the move does not reset the version or break OpenAPI version lookup.
- [x] Update Renovate paths if needed and document API workspace commands and
  the temporary external UI deployment arrangement.
- [x] Verify clean frozen installation, Prisma generation, API lint/typecheck,
  tests/coverage, and migrations against a disposable database.
- [x] Build the container with each external UI branch selection. Smoke-test
  startup, UI/assets/deep links, API success/404 responses, login, and event flows.
- [x] Review the final diff and record exact local validation results.
- [x] Publish the focused draft PR: https://github.com/edge33/sibarifly-dashboard-api/pull/91.
- [x] Verify hosted PR checks (integration commit `2ed12e7`, GitHub Actions run
  `43032191829`, passed).
- [ ] Record the previous deployed image digest before merge; verify development
  after merge.
- [x] Verify release configuration/preview and production container readiness.
- [ ] Record production validation when an authorized normal release occurs.

Gate: API now lives in `apps/api`; development and production builds still fetch
the external UI exactly as before. API CI, migrations, and releases remain usable.
No UI import or UI deployment cutover belongs in this PR.

## PR 2: Import UI history and integrate development, external UI still deployed

- [ ] Start from merged PR 1. Refresh UI branch divergence and record source SHAs.
- [ ] Back up UI branches/tags and record recovery locations. Preserve any
  branch with unique commits through named refs/backups and document its status;
  importing `main` preserves its ancestry, not every repository ref.
- [ ] Verify Git subtree availability and merge-commit support. Resolve any
  squash-only or linear-history restriction before opening the import PR.
- [ ] Import the recorded UI `main` tip into `apps/web` without `--squash`.
  Preserve both repositories' license files and attribution.

Illustrative import commands (adapt remote setup if it already exists):

```sh
git remote add ui-history https://github.com/edge33/sibarifly-landing-form.git
git fetch ui-history --no-tags
git subtree add --prefix=apps/web <recorded-ui-main-sha>
```

- [ ] Record the import commit. Before integration edits, compare the subtree
  with the source tree and verify original commit IDs/authors/messages remain
  accessible. Run `git merge-base --is-ancestor <original-ui-tip> HEAD`.
- [ ] In a separate commit, integrate `apps/web` into the root installation:
  merge UI dependency overrides into root workspace settings, use root toolchain
  pins, consolidate the lockfile, and remove superseded nested workspace files.
  Review unexpected dependency resolution changes.
- [ ] Preserve UI-specific Biome and TypeScript settings. Ensure existing root
  lint/format commands do not apply API rules or formatting to imported UI source.
- [ ] Add root commands for UI development/build/lint and running both apps.
  Document `VITE_API_URL=/api` and verify the existing proxy to API port 8000.
- [ ] Add UI lint/build to root PR checks and appropriate development checks.
  Consolidate the imported nested workflow into root workflows; nested GitHub
  workflow files do not execute automatically.
- [ ] Verify Renovate and release previews cover UI changes while historical
  imported commits are not replayed as new changelog entries.
- [ ] Keep image packaging limited to intended API runtime files and externally
  built UI assets. Do not accidentally switch to local UI merely because it is
  now present in the Docker build context.
- [ ] Document the transition: deployed UI changes still belong in the external
  repository until PR 3; avoid competing edits in both copies. Track changes
  after import for final reconciliation. Do not freeze UI development for the
  entire multi-PR migration.
- [ ] Verify frozen install, existing API checks, UI lint/build, local UI/API
  communication, and the production container still using external UI branches.
- [ ] Review/publish when authorized; merge with a merge commit and verify the
  original UI tip is an ancestor of actual remote `main` after merge.
- [ ] Verify development deployment remains healthy with external UI assets.

Gate: UI source and original ancestry exist in the workspace, local development
and CI cover both apps, and deployed images still use the external UI repository.
Historical UI commits retain their original paths; history is not path-rewritten.

## PR 3: Reconcile UI and switch deployment to monorepo source

- [ ] Start from merged PR 2. Coordinate a short external UI merge freeze or
  explicit final reconciliation window for cutover.
- [ ] Fetch fresh UI refs and inspect changes since import, including unique
  `develop` changes. Record the exact final UI revision and resolve which
  changes should ship together before replacing branch-specific builds.
- [ ] Import intervening UI history without squashing (for example using
  `git subtree merge --prefix=apps/web <final-ui-main-sha>`), resolve integration
  conflicts, and retain any branch history not being integrated in backups/refs.
- [ ] Verify original and newly imported UI tips remain ancestors. Any PR with
  additional imported ancestry must use a merge commit too.
- [ ] Build UI from local `apps/web` using the root frozen installation and
  copy its output to the API static asset location.
- [ ] Remove the external UI clone, `WEB_APP_BRANCH`, obsolete Git clone tooling,
  and related flags from Docker, both Cloud Build files, Makefile, and docs.
  Preserve `VITE_API_URL=/api` at UI build time.
- [ ] Verify final runtime dependency links, Prisma client, runtime manifest,
  static files, revision/version labels, and deployment by image digest.
- [ ] Update `.dockerignore` for nested dependencies, secrets, and generated
  output. Review cache changes separately from migration correctness.
- [ ] Verify both pipelines build API/UI from one revision; retain deployment on
  `main` and production on stable tags. Confirm required validation covers the
  exact source used for release images.
- [ ] Verify UI-only fixes/features participate in the single release stream
  and documentation explains the end of external UI branch selection.
- [ ] Run fresh frozen installation, Prisma generation, API checks, UI lint/build,
  disposable-database migrations, and production-container smoke tests for UI
  entry/assets/deep links, API success/404s, login/refresh, and event flows.
- [ ] Review the final diff for secrets, generated files, unrelated changes, and
  lockfile churn. Record checks that could not run and resolve material blockers.
- [ ] Record the previous working image digest and rollback procedure. An
  application rollback does not undo database migrations; external UI must stay
  available while older pipelines may still need it.
- [ ] Publish/merge when authorized and verify ancestry on remote `main`,
  development deployment, first normal release preview/tag, and production.
- [ ] After successful cutover, add an external repository migration notice,
  retire obsolete automation, and archive it when authorized. Retain issues/PR
  discussions and backups; Git imports do not transfer GitHub metadata.

Gate: both environments deploy API/UI from monorepo revisions; the old UI workflow
is retired only after validation. No repository rename is part of this work.

## Progress log

| Date       | Phase               | Outcome / evidence                                                                                                                | Remaining work                                                           |
| ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 2026-11-11 | Planning            | Inspected API configuration and UI history; agreed on pnpm without Turbo/Nx.                                                      | All implementation pending.                                              |
| 2026-11-11 | Plan revision       | Split into three independently deployable PRs; API structure first, retaining external UI through PR 2.                           | Execute PR 1 before UI import or deployment cutover.                     |
| 2026-11-11 | PR 1 implementation | API moved; workspace/tooling/container/release changes verified locally, including a clean install and both external UI branches. | Draft PR #91 open; hosted checks passed, post-merge deployments pending. |

## PR 1 validation evidence

- Branch: `refactor/api-workspace`, based on API
  `60fd9a7bbfab1d083aaaa4e85513144b62983a9c`.
- Mechanical move commit: `fca13c2`; workspace integration commit: `2ed12e7`.
- Ref backup: `/tmp/sibarifly-api-before-workspace.bundle`, verified with
  `git bundle verify`. Recover with `git clone <bundle> <new-directory>`, then
  check out the recorded baseline SHA. The backup is local and temporary;
  preserve it elsewhere if longer retention is needed.
- Fresh-checkout checks in `/tmp/sibarifly-workspace-clean`:
  `pnpm install --frozen-lockfile`, `pnpm prisma-generate`, `pnpm lint`,
  `pnpm typecheck`, and `pnpm test:coverage` passed. All 18 tests passed.
  This checkout had no prior dependencies, generated client, or local `.env`.
- `pnpm --filter sibarifly-dashboard-api lint` passed. Locked package resolutions,
  snapshots, and package-manager metadata are byte-for-byte unchanged; only
  importers moved. The existing locked `dotenv` version is now explicitly
  declared for the API Prisma config.
- `pnpm prisma-migrate` applied all five migrations to isolated PostgreSQL on
  port 15432; direct `./node_modules/.bin/prisma migrate deploy` from `apps/api`
  also passed, matching the development Cloud Build step.
- Both `docker build --build-arg WEB_APP_BRANCH=develop --build-arg
  VITE_API_URL=/api -t sibarifly-api-workspace:develop .` and the corresponding
  `WEB_APP_BRANCH=main` / `:main` build passed. Logs:
  `/tmp/sibarifly-workspace-build-develop.log` and
  `/tmp/sibarifly-workspace-build-main.log`.
- `/tmp/sibarifly-workspace-smoke.py` passed against both packaged images:
  UI entry, JS/CSS assets, SPA deep links, API 404s, invalid/valid login,
  refresh cookies, and database-backed event creation/listing.
- Development-mode startup and `/docs/json` verified the moved API manifest's
  `1.3.0` version and development dependencies.
- `node /tmp/sibarifly-release-preview/check.cjs` exercised the Release Please
  Node strategy locally: patch/feature previews update root and API manifests
  together to `1.3.1`/`1.4.0`, preserving the root changelog and unprefixed
  `vX.Y.Z` tag format. No release was published or project dependency added.
- `make -n build` confirms the existing development UI branch selection.
- Existing PR #63 also edits Cloud Build deployment behavior; coordinate any
  merge conflicts without folding that unrelated change into this PR.
- Draft PR: https://github.com/edge33/sibarifly-dashboard-api/pull/91.
- Temporary validation containers/network and the development process were
  stopped and removed; built verification images remain available locally.
- Hosted PR checks passed on integration commit `2ed12e7` in GitHub Actions
  run `43032191829`; see the PR for checks on subsequent tracker-only commits.
- Cloud deployments and the currently deployed rollback digest remain pending. Do not mark post-merge gates complete based on local tests.

## Implementation handoff

- Current phase / PR link: PR 1, https://github.com/edge33/sibarifly-dashboard-api/pull/91 (draft).
- Worktree / branch: `/home/edge33/dev/sibarifly-dashboard-api`, `refactor/api-workspace`.
- API baseline SHA: `60fd9a7bbfab1d083aaaa4e85513144b62983a9c`.
- UI import SHA / final reconciliation SHA / import commits: pending.
- Backup locations and preserved refs: `/tmp/sibarifly-api-before-workspace.bundle` (all original API refs).
- Checks run and results: PR 1 local and hosted checks passed; see validation evidence above.
- Deployment evidence / rollback image digest: pending.
- External actions / blockers: rollback digest capture, merge and deployment validation pending.
