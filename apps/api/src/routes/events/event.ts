import { Type } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';
import { Event, HttpError } from '../../types/index.ts';

export default async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request, reply) => {
    app.verifyJWT(request, reply);
  });

  app.get<{ Params: { eventId: number } }>(
    '/:eventId',
    {
      schema: {
        tags: ['Events'],
        params: Type.Object({ eventId: Type.Number() }),
        response: {
          200: Event,
          404: HttpError
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;

      let data: Awaited<ReturnType<typeof app.prisma.event.findUnique>>;
      try {
        data = await app.prisma.event.findUnique({ where: { id: eventId } });
      } catch (error) {
        app.log.error(error);
        throw new Error('Internal server error');
      }
      if (!data) {
        return reply.callNotFound();
      }
      return reply.send(data);
    }
  );

  return app;
};
