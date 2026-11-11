import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { it, type TestContext } from 'node:test';

const configUrl = new URL('../../prisma.config.ts', import.meta.url).href;

function loadConfig(t: TestContext, contents?: string, variables: NodeJS.ProcessEnv = {}) {
  const cwd = mkdtempSync(path.join(tmpdir(), 'sibarifly-prisma-env-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  if (contents !== undefined) {
    writeFileSync(path.join(cwd, '.env'), contents);
  }
  const env = { ...process.env };
  delete env.DATABASE_URL;
  delete env.DIRECT_URL;

  return {
    cwd,
    run: () =>
      spawnSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `const { default: config } = await import(${JSON.stringify(configUrl)});
           console.log(JSON.stringify(config.datasource.url));`
        ],
        { cwd, env: { ...env, ...variables }, encoding: 'utf8' }
      )
  };
}

it('loads the Prisma database URL from .env and prefers the direct connection', (t) => {
  const { run } = loadConfig(
    t,
    'DATABASE_URL=postgresql://local/db\nDIRECT_URL=postgresql://direct/db'
  );
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout), 'postgresql://direct/db');
});

it('preserves environment variables supplied by deployment over .env values', (t) => {
  const { run } = loadConfig(t, 'DATABASE_URL=postgresql://local/db', {
    DATABASE_URL: 'postgresql://deployment/db'
  });
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout), 'postgresql://deployment/db');
});

it('uses supplied database variables when .env is absent', (t) => {
  const { run } = loadConfig(t, undefined, { DATABASE_URL: 'postgresql://deployment/db' });
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout), 'postgresql://deployment/db');
});

it('allows client generation without .env or database variables', (t) => {
  const { run } = loadConfig(t);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout), '');
});

it('does not hide errors other than a missing .env file', (t) => {
  const { cwd, run } = loadConfig(t);
  mkdirSync(path.join(cwd, '.env'));
  const result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /\.env/);
});
