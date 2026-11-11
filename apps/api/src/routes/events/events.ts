import { Type } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';
import { Event } from '../../types/index.ts';

export default async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request, reply) => {
    app.verifyJWT(request, reply);
  });

  app.get(
    '/',
    {
      schema: {
        tags: ['Events'],
        response: {
          200: Type.Array(Event)
        }
      }
    },
    async (_request, reply) => {
      const data = await app.prisma.event.findMany({ orderBy: { dateTime: 'desc' } });
      return reply.send(data);
    }
  );

  return app;
};
