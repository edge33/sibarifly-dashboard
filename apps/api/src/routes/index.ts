import type { FastifyInstance } from 'fastify';
import auth from './auth/index.ts';
import events from './events/index.ts';

export default async (app: FastifyInstance) => {
  app.register(events, { prefix: 'events' });
  app.register(auth, { prefix: 'auth' });
};
