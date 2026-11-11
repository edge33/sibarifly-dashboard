import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PrismaClient } from '@prisma/client/extension';
import fastify from 'fastify';
import create from '../../../../routes/events/create.ts';

describe('create', () => {
  it('should create an event', async (t) => {
    const capturedCreate = t.mock.fn(() => Promise.resolve({ result: { id: 1 } }));
    const app = fastify();
    const prisma: PrismaClient = {
      event: { create: capturedCreate }
    };
    app.decorate('prisma', prisma);
    app.register(create);
    const payload = {
      dateTime: '2024-01-01',
      eventType: 'ARRIVAL',
      aircraftType: 'GA',
      aircraftRegistration: 'registration',
      aircraftModel: 'model',
      pilotInCommand: 'pilotInCommand',
      firstOfficer: 'firstOfficer',
      departure: 'departure',
      paxNumber: 1,
      destination: 'destination',
      emailAddress: '',
      mobilePhone: '98787978'
    };

    const response = await app.inject({
      method: 'POST',
      url: '/',
      headers: { 'content-type': 'application/json' },
      payload
    });

    const args = capturedCreate.mock.calls[0].arguments[0];
    assert.deepEqual(args, {
      data: { ...payload, dateTime: new Date(payload.dateTime) }
    });

    assert.equal(response.statusCode, 201);
  });

  it('should throw an error with invalid data', async (t) => {
    const app = fastify();
    const capturedCreate = t.mock.fn(() => Promise.reject(new Error()));
    const prisma: PrismaClient = {
      event: { create: capturedCreate }
    };

    app.register(create);
    app.decorate('prisma', prisma);

    const payload = {
      dateTime: '2024-01-01T00:00:00.000Z',
      eventType: 'ARRIVAL',
      aircraftType: 'GA',
      aircraftRegistration: 'registration',
      aircraftModel: 'model',
      pilotInCommand: 'pilotInCommand',
      firstOfficer: 'firstOfficer',
      paxNumber: 1,
      departure: 'departure',
      destination: 'destination',
      mobilePhone: '98787978'
    };

    const response = await app.inject({
      method: 'POST',
      url: '/',
      headers: { 'content-type': 'application/json' },
      payload
    });

    assert.equal(response.statusCode, 500);
  });
});
