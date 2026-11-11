import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import type { PrismaClient } from '@prisma/client/extension';
import fastify, { type FastifyInstance } from 'fastify';
import event from '../../../../routes/events/event.ts';

describe('event', () => {
  let app: FastifyInstance;
  beforeEach(async () => {
    app = fastify();
    app.decorate('verifyJWT', () => Promise.resolve());
    const prisma: PrismaClient = {
      event: {
        findUnique: (query: { where: { id: number } }) => {
          if (query.where.id === 1) {
            return Promise.resolve({
              id: 1,
              eventType: 'DEPARTURE',
              dateTime: '2024-01-01',
              aircraftRegistration: 'registration',
              aircraftModel: 'model',
              aircraftType: 'GA',
              pilotInCommand: 'pilotInCommand',
              firstOfficer: 'firstOfficer',
              paxNumber: 0,
              departure: 'departure',
              destination: 'destination',
              emailAddress: 'mail@mail.com'
            });
          }
          if (query.where.id === 2) {
            return Promise.resolve(undefined);
          }
          return Promise.reject(new Error());
        }
      }
    };
    app.decorate('prisma', prisma);
    app.register(event);
  });

  it('should return an event with an id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/1'
    });

    assert.deepEqual(response.json(), {
      id: 1,
      eventType: 'DEPARTURE',
      dateTime: '2024-01-01',
      aircraftRegistration: 'registration',
      aircraftModel: 'model',
      aircraftType: 'GA',
      pilotInCommand: 'pilotInCommand',
      firstOfficer: 'firstOfficer',
      paxNumber: 0,
      departure: 'departure',
      destination: 'destination',
      emailAddress: 'mail@mail.com'
    });
    assert.equal(response.statusCode, 200);
  });

  it('should return 404 when event with a given id is not found', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/2'
    });

    assert.equal(response.statusCode, 404);
  });

  it('should return 500 when event query throws', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/3'
    });

    assert.equal(response.statusCode, 500);
  });
});
