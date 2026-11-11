import { EventData, EventFormData } from '../types';
import { getDateTimeString } from './getCurrentDateTime';

export default (eventData: EventData): EventFormData => {
  return {
    eventId: eventData.id,
    arrivalDateTime: getDateTimeString(eventData.dateTime),
    departureDateTime: getDateTimeString(eventData.dateTime),
    eventType: eventData.eventType,
    aircraftType: eventData.aircraftType,
    aircraftRegistration: eventData.aircraftRegistration,
    aircraftModel: eventData.aircraftModel,
    pilotInCommand: eventData.pilotInCommand,
    firstOfficer: eventData.firstOfficer,
    paxNumber: eventData.paxNumber,
    departure: eventData.departure,
    destination: eventData.destination,
    mobilePhone: eventData.mobilePhone,
    emailAddress: eventData.emailAddress,
  };
};
