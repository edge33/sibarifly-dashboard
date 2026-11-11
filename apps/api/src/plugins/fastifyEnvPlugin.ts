import fastifyEnv from '@fastify/env';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { envSchema } from '../config.ts';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      DATABASE_URL: string;
      ENVIRONMENT: 'development' | 'production' | 'test';
      JWT_AUTH_TOKEN_SECRET: string;
      JWT_AUTH_TOKEN_EXPIRES_IN: string;
      JWT_REFRESH_TOKEN_SECRET: string;
      JWT_REFRESH_TOKEN_EXPIRES_IN: string;
      DOMAIN: string;
      ADMIN_PASSWORD: string;
    };
  }
}

const fastifyEnvPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(fastifyEnv, {
    schema: envSchema
  });
});

export default fastifyEnvPlugin;
