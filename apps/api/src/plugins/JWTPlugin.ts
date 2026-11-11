import fastifyJWT, { type FastifyJwtNamespace } from '@fastify/jwt';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// https://github.com/fastify/fastify-jwt/issues/321
declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'auth' }> {}

  interface FastifyRequest {
    // Custom namespace
    authJwtVerify: FastifyRequest['jwtVerify'];
    authJwtDecode: FastifyRequest['jwtDecode'];
  }

  interface FastifyReply {
    // Custon namespace
    authJwtSign: FastifyReply['jwtSign'];
  }
}

declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'refresh' }> {}

  interface FastifyRequest {
    // Custom namespace
    refreshJwtVerify: FastifyRequest['jwtVerify'];
    refreshJwtDecode: FastifyRequest['jwtDecode'];
  }

  interface FastifyReply {
    // Custon namespace
    refreshJwtSign: FastifyReply['jwtSign'];
  }
}

const JWTPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(fastifyJWT, {
    secret: server.config.JWT_AUTH_TOKEN_SECRET,
    sign: {
      expiresIn: server.config.JWT_AUTH_TOKEN_EXPIRES_IN
    },
    namespace: 'auth',
    jwtVerify: 'authJwtVerify',
    jwtSign: 'authJwtSign'
  });

  server.register(fastifyJWT, {
    secret: server.config.JWT_REFRESH_TOKEN_SECRET,
    sign: {
      expiresIn: server.config.JWT_REFRESH_TOKEN_EXPIRES_IN
    },
    cookie: {
      cookieName: 'refreshToken',
      signed: false
    },
    namespace: 'refresh',
    jwtVerify: 'refreshJwtVerify',
    jwtSign: 'refreshJwtSign'
  });
});

export default JWTPlugin;
