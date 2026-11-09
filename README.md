# fastify-boilerplate

authenticate against gcloud in order to obtain the credentials

`gcloud auth application-default login `

A simple boilerplate to bootstrap a fastify app

built with [pnpm](https://pnpm.io/)

it features

- Typescript
- Biome
- Editorconfig

## Local verification

Use Node 24 and pnpm 12. The test database is defined in `docker-compose-test.yml`.
Development, tests, and production run TypeScript directly with Node's built-in type stripping. Use `pnpm typecheck` to check types without emitting JavaScript.

```sh
docker compose -f docker-compose-test.yml up -d db
pnpm install --frozen-lockfile
pnpm prisma-generate
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/postgres \
  DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:5432/postgres \
  pnpm prisma migrate deploy
pnpm lint
pnpm typecheck
pnpm test
```

## Dependency updates

Renovate is configured in `renovate.json` to update pnpm dependencies and the
lockfile, Dockerfile base images, GitHub Actions, and build-step images in both
`cloudbuild.yaml` and `cloudbuild.production.yaml`. The pnpm version in
`package.json` and the install commands in Docker and Cloud Build are grouped in
one PR. Docker images and GitHub Actions are pinned to digests, with subsequent
digest updates proposed by Renovate. Updates require review; automerge is disabled.

Install the [Renovate GitHub App](https://github.com/apps/renovate) and grant it
access to this repository, then merge this configuration into `main`. The hosted
app runs Renovate; no additional workflow or repository token is needed. Use the
Dependency Dashboard issue to review pending updates and configuration warnings.

## Releases and deployments

Every merge to `main` deploys to development. Release Please maintains a release
PR containing the next version and changelog. Merge that PR when ready to release;
it creates a stable `vMAJOR.MINOR.PATCH` tag and GitHub release. Cloud Build then
builds the release image using the latest frontend `main`, runs production migrations,
and deploys to production.
A GitHub release records a version; check Cloud Build for actual deployment status.

Use Conventional Commit squash-merge titles: `fix:` for patches, `feat:` for
features, and `!` or a `BREAKING CHANGE:` footer for breaking API changes. Other
commit types do not normally create releases. Review generated release notes and
include database migration requirements before merging. Never overwrite release
tags. The initial manifest uses the existing `1.0.0` package version as a baseline;
`bootstrap-sha` excludes earlier repository history from the first release.

### GitHub setup (required before enabling Release Please)

1. Create a fine-grained PAT scoped to this repository with Contents, Issues, and
   Pull requests read/write permissions; store it as the Actions secret
   `RELEASE_PLEASE_TOKEN`. A GitHub App installation token with equivalent access
   can replace it later. Do not use `GITHUB_TOKEN`: bot-created release PRs must
   trigger the existing PR checks. Set an expiry and rotate the credential.
2. Require PR checks and Conventional Commit squash-merge titles on `main`.
   Permit the release identity to create PRs, labels, tags, and releases without
   bypassing PR review. GitHub Actions needs permission to create pull requests
   if the repository's Actions settings restrict that capability.
3. Merge this configuration. Release Please will manage `package.json`,
   `.release-please-manifest.json`, and `CHANGELOG.md`; do not bump them manually.

### Cloud Build setup (required before switching deployments)

These files define pipelines, not cloud resources. Configure the repository
connection, two triggers, Secret Manager entries, and IAM in Google Cloud. Disable
old branch-based production triggers when switching, so ordinary merges cannot
deploy to production. Configure both triggers before releasing.

| Setting                | Development                          | Production                              |
| ---------------------- | ------------------------------------ | --------------------------------------- |
| Event                  | Push to branch `^main$`              | Push to tag `^v[0-9]+\.[0-9]+\.[0-9]+$` |
| Build configuration    | `cloudbuild.yaml`                    | `cloudbuild.production.yaml`            |
| File filters           | None: every merge deploys            | None                                    |
| `_SERVICE` default     | `sibarifly-dashboard-develop`        | `sibarifly-dashboard-main`              |
| `_REGION` default      | `europe-west8`                       | `europe-west8`                          |
| `_DATABASE_URL_SECRET` | Development database URL secret name | Production database URL secret name     |
| `_DIRECT_URL_SECRET`   | Development direct URL secret name   | Production direct URL secret name       |

Set `_SERVICE` to your existing Cloud Run service names if different. Existing
Cloud Run runtime environment variables and service identities must already be
configured separately; build-time database secrets are only for migrations.
Use `ENVIRONMENT=production` for both Cloud Run services: this selects the packaged
runtime mode, while their service names and database settings select the environment.
Store database URLs in Secret Manager, not plaintext trigger substitutions. Both
triggers must use the same project and image repository. The existing `gcr.io`
image path is retained and must be backed by a working Artifact Registry
migration/repository. Cloud Build must be able to reach each database.

Use separate build service accounts. Development needs image push/read, development
Cloud Run deployment and runtime-service-account impersonation, log writing, and
access to development database secrets. Production needs image push/read,
production Cloud Run deployment and runtime-service-account impersonation, log writing, and access to production
database secrets. Only trusted administrators should edit these triggers or their
service accounts. Neither deployment identity should have unnecessary access to
the other environment's database.

Merging the release PR is the manual release decision. Optionally configure
**Require approval before build executes** on the production trigger for a separate
Cloud Build approval before any production migrations or deployment. This does
not require a manually dispatched GitHub Actions workflow.

### Images and frontend branches

| API build                  | Frontend branch  | Image tag                 |
| -------------------------- | ---------------- | ------------------------- |
| Push to `main`             | Latest `develop` | `<commit SHA>-<build ID>` |
| Release tag, e.g. `v1.2.3` | Latest `main`    | `v1.2.3`                  |

For example, a release publishes
`gcr.io/<project>/github.com/edge33/sibarifly-dashboard:v1.2.3`.
Development builds keep separate tags so repeated merges at the same package
version cannot overwrite a release image. OpenAPI reads the package version.

Both builds pass `WEB_APP_BRANCH` explicitly and disable Docker layer caching so
the frontend is fetched from the requested branch for each build. Frontend commits
are intentionally not pinned. Release builds create a new image rather than reuse
the development image, since they include a different frontend branch. A retry
can pick up newer frontend changes and replace the versioned image tag.

The development pipeline runs the existing application checks before building.
Release Please owns version consistency. The release pipeline builds and pushes
the versioned image, runs migrations, and deploys.
Both pipelines resolve the pushed image digest for the Cloud Run deployment.

Release in increasing version order and allow one production migration/deployment
at a time. Prisma migrations must support the application still running during
rollout (expand/contract for breaking schema changes). An application rollback
does not undo database migrations.
