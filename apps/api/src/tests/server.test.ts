import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import type { FastifyInstance } from 'fastify';

mock.module('../plugins/prismaPlugin.ts', {
  exports: { default: async () => {} }
});

const { default: buildApp } = await import('../server.ts');

let app: FastifyInstance;

beforeEach(async () => {
  process.env.ENVIRONMENT = 'test';
  app = await buildApp();
});

afterEach(async () => {
  await app.close();
});

describe('server', () => {
  it('should return error with correct format', async () => {
    app.get('/', async () => {
      throw new Error('test');
    });
    const response = await app.inject({ method: 'GET', url: '/' });

    assert.equal(response.statusCode, 500);
    assert.deepEqual(response.json(), {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal server error'
    });
  });

  it('plugins and routes are registered', async () => {
    app.get('/', async (request, response) => {
      assert.ok('cookies' in request);
      assert.ok('authJwtVerify' in request);
      assert.ok('authJwtDecode' in request);
      assert.ok('refreshJwtVerify' in request);
      assert.ok('refreshJwtDecode' in request);
      assert.ok('authJwtSign' in response);
      assert.ok('refreshJwtSign' in response);
    });

    await app.ready();
    assert.ok('verifyJWT' in app);
    assert.ok(app.hasRoute({ method: 'POST', url: '/api/auth/login' }));
    const response = await app.inject({ method: 'GET', url: '/' });
    assert.equal(response.statusCode, 200);
  });

  it('registers swagger plugin in DEV mode', async (t) => {
    process.env.ENVIRONMENT = 'development';
    t.after(() => {
      process.env.ENVIRONMENT = 'test';
    });
    const devApp = await buildApp();
    t.after(async () => {
      await devApp.close();
    });
    await devApp.ready();

    assert.ok(devApp.hasRoute({ method: 'GET', url: '/docs/' }));
  });

  it('not found handler should return index.html for non-api routes', async () => {
    const response = await app.inject({ method: 'GET', url: '/test' });

    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['content-type'], 'text/html; charset=utf-8');
  });

  it('not found handler should return 404 for api routes', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/test' });

    assert.equal(response.statusCode, 404);
    assert.deepEqual(response.json(), {
      message: 'Not found',
      error: 'Not found',
      statusCode: 404
    });
  });
});
