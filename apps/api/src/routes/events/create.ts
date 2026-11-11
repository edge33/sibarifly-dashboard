import type { FastifyInstance } from 'fastify';
import { Event, type EventType, HttpError } from '../../types/index.ts';

export default async (app: FastifyInstance) => {
  app.post<{ Body: EventType }>(
    '/',
    {
      schema: {
        tags: ['Events'],
        body: Event,
        response: {
          '500': HttpError
        }
      }
    },
    async (request, reply) => {
      const {
        dateTime,
        aircraftModel,
        aircraftRegistration,
        aircraftType,
        departure,
        destination,
        emailAddress,
        eventType,
        mobilePhone,
        paxNumber,
        pilotInCommand,
        firstOfficer
      } = request.body;

      try {
        const result = await app.prisma.event.create({
          data: {
            dateTime: new Date(dateTime),
            eventType,
            aircraftType,
            aircraftRegistration,
            aircraftModel,
            pilotInCommand,
            firstOfficer,
            paxNumber,
            departure,
            destination,
            emailAddress,
            mobilePhone
          }
        });
        reply.header('location', `/events/${result.id}`);
        return reply.status(201).send();
      } catch (error) {
        app.log.error(error);
        throw new Error('Internal server error');
      }
    }
  );

  return app;
};
