import { type Static, Type } from '@sinclair/typebox';

export const Event = Type.Object({
  id: Type.Optional(Type.Number()),
  dateTime: Type.String(),
  eventType: Type.Union([Type.Literal('ARRIVAL'), Type.Literal('DEPARTURE')]),
  aircraftType: Type.Union([Type.Literal('GA'), Type.Literal('ULM')]),
  aircraftRegistration: Type.String(),
  aircraftModel: Type.String(),
  pilotInCommand: Type.String(),
  firstOfficer: Type.Optional(Type.String()),
  paxNumber: Type.Number({ default: 0 }),
  departure: Type.String(),
  destination: Type.String(),
  mobilePhone: Type.Optional(Type.String()),
  emailAddress: Type.Optional(Type.String())
});

export type EventType = Static<typeof Event>;

export const HttpError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
  time: Type.Optional(Type.String())
});

export type HttpErrorType = Static<typeof HttpError>;

export const LoginCredentials = Type.Object({
  username: Type.String(),
  password: Type.String()
});

export type LoginCredentialsType = Static<typeof LoginCredentials>;
