import type { FastifyInstance } from 'fastify';
import create from './create.ts';
import event from './event.ts';
import events from './events.ts';

export default async (app: FastifyInstance) => {
  app.register(create);
  app.register(events);
  app.register(event);
};
