import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import type { FastifyInstance } from 'fastify';

const getAuthTokenAndCookie = async (app: FastifyInstance) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      username: 'admin',
      password: 'admin'
    }
  });
  const body = JSON.parse(response.body);
  const cookie = response.headers['set-cookie'];

  return { token: body.token, cookie };
};

mock.module('../../../plugins/prismaPlugin.ts', {
  exports: { default: async () => {} }
});

const { default: buildApp } = await import('../../../server.ts');
let app: FastifyInstance;

beforeEach(async () => {
  app = await buildApp();
});

afterEach(async () => {
  await app.close();
});

describe('auth', () => {
  it('should return Unauthorized response when credentials are invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: 'api/auth/login',
      payload: {
        username: 'invalid',
        password: 'invalid'
      }
    });

    assert.equal(response.statusCode, 401);
  });

  it('should return access token and refresh token with valid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: 'api/auth/login',
      payload: {
        username: 'admin',
        password: 'admin'
      }
    });
    const body = JSON.parse(response.body);
    const cookie = response.headers['set-cookie'];

    assert.equal(typeof body.token, 'string');
    assert.ok(cookie?.toString().includes('refreshToken'));
  });

  it('should return Unauthorized response when refreshToken is invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: 'api/auth/refreshToken',
      headers: {
        Cookie: 'refreshToken=invalid'
      }
    });

    assert.equal(response.statusCode, 401);
  });

  it('should return new access token and refresh token when issuing a valid refreshtoken', async () => {
    const { cookie: refreshCookie } = await getAuthTokenAndCookie(app);

    const response = await app.inject({
      method: 'POST',
      url: 'api/auth/refreshToken',
      headers: {
        Cookie: refreshCookie
      }
    });

    const body = JSON.parse(response.body);
    const cookie = response.headers['set-cookie'];
    assert.equal(typeof body.token, 'string');
    assert.ok(cookie?.toString().includes('refreshToken'));
  });
});
