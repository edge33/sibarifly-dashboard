import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import fastify from 'fastify';
import authPlugin from '../../plugins/authPlugin.ts';

describe('authPlugin', () => {
  it('should decorate the server with verifyJWT method', async () => {
    const app = fastify();
    app.register(authPlugin);
    await app.ready();
    assert.ok('verifyJWT' in app);
  });

  it('should call authJwtVerify when calling verifyJWT', async (t) => {
    const app = fastify();
    const capturedAuthJwtVerify = t.mock.fn(() => Promise.resolve());
    app.decorateRequest('authJwtVerify', capturedAuthJwtVerify);
    await app.register(authPlugin);
    app.get('/', async (request, reply) => {
      return await app.verifyJWT(request, reply);
    });
    await app.ready();
    await app.inject({
      method: 'GET',
      url: '/'
    });
    assert.equal(capturedAuthJwtVerify.mock.calls.length, 1);
  });

  it('should return Unauthorized response when authJwtVerify throws', async () => {
    const app = fastify();
    app.decorateRequest('authJwtVerify', () => {
      throw new Error();
    });
    await app.register(authPlugin);
    app.get('/', async (request, reply) => {
      return await app.verifyJWT(request, reply);
    });
    await app.ready();
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });
    assert.equal(response.statusCode, 401);
  });
});
