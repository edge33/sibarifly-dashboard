import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PrismaClient } from '@prisma/client/extension';
import fastify from 'fastify';
import events from '../../../../routes/events/events.ts';

const payload = [
  {
    id: 1,
    dateTime: '2024-01-01',
    eventType: 'ARRIVAL',
    aircraftType: 'GA',
    aircraftRegistration: 'aircraft',
    aircraftModel: 'model',
    pilotInCommand: 'pilotInCommand',
    firstOfficer: 'firstOfficer',
    paxNumber: 0,
    departure: 'departure',
    destination: 'destination'
  },
  {
    id: 2,
    dateTime: '2024-01-01',
    eventType: 'DEPARTURE',
    aircraftType: 'ULM',
    aircraftRegistration: 'registration',
    aircraftModel: 'aircraft',
    pilotInCommand: 'pilotInCommand',
    firstOfficer: 'firstOfficer',
    paxNumber: 0,
    departure: 'departure',
    destination: 'destination'
  }
];

const buildInstance = (withError: boolean) => {
  const prisma: PrismaClient = {
    event: {
      findMany: () => {
        if (withError) {
          return Promise.reject(new Error());
        }
        return Promise.resolve(payload);
      }
    }
  };
  const app = fastify();
  app.decorate('verifyJWT', () => Promise.resolve());
  app.decorate('prisma', prisma);
  app.register(events);
  return app;
};

describe('events', () => {
  it('should return all the events', async () => {
    const app = buildInstance(false);
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    assert.deepEqual(response.json(), payload);
    assert.equal(response.statusCode, 200);
  });
});
