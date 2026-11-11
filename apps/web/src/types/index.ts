export const ARRIVAL = 'ARRIVAL';
export const DEPARTURE = 'DEPARTURE';
export const STOP = 'STOP';
type EventType = typeof ARRIVAL | typeof DEPARTURE | typeof STOP;

export const GA = 'GA';
export const ULM = 'ULM';

export type EventData = {
  id?: number;
  dateTime: string;
  eventType: EventType;
  aircraftType: typeof GA | typeof ULM;
  aircraftRegistration: string;
  aircraftModel: string;
  pilotInCommand: string;
  firstOfficer?: string;
  paxNumber: number;

  departure: string;
  destination: string;

  mobilePhone: string;
  emailAddress: string;
};

export type EventFormData = {
  eventId?: number;
  arrivalDateTime: string;
  departureDateTime: string;
  eventType: EventType;
  aircraftType: typeof GA | typeof ULM;
  aircraftRegistration: string;
  aircraftModel: string;
  pilotInCommand: string;
  firstOfficer?: string;
  paxNumber: number;

  departure: string;
  destination: string;

  mobilePhone: string;
  emailAddress: string;
};
