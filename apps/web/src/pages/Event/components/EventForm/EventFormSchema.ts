import { z } from 'zod';
import { ARRIVAL, DEPARTURE, GA, STOP, ULM } from '../../../../types';

const mandatoryField = 'This field is mandatory';

const requiredString = z.string().trim().min(1, { message: mandatoryField });

// const presentDateError = 'Date cannot be in the future';

export const EventFormSchema = z
  .object({
    arrivalDateTime: z.string({ error: mandatoryField }).min(1, mandatoryField),
    // .refine(
    //   data_ => {
    //     return new Date(data_) <= new Date();
    //   },
    //   {
    //     message: presentDateError,
    //   },
    // ),
    departureDateTime: z.string(),

    eventType: z.union([
      z.literal(ARRIVAL),
      z.literal(DEPARTURE),
      z.literal('STOP'),
    ]),
    aircraftType: z.union([z.literal(GA), z.literal(ULM)]),

    aircraftRegistration: requiredString,
    aircraftModel: requiredString,
    pilotInCommand: requiredString,
    firstOfficer: z.string().optional(),
    paxNumber: z.coerce
      .number<string | number>()
      .gte(0, 'Minimum value is zero')
      .lte(50, 'Maximum value is 50')
      .default(0),
    departure: z.string().default(''),
    destination: requiredString,
    mobilePhone: z
      .string()
      .default('')
      .refine(
        val => {
          return !val || /^\+{0,1}\d+$/.test(val);
        },
        {
          message: 'The phone number must consist of digits.',
        },
      ),
    emailAddress: z.union([
      z.literal(''),
      z.email({ error: 'Type a valid email address' }),
    ]),
  })
  .superRefine(
    ({ eventType, departureDateTime, arrivalDateTime, departure }, ctx) => {
      if (eventType === STOP) {
        if (!departureDateTime) {
          ctx.addIssue({
            path: ['departureDateTime'],
            code: 'custom',
            message: mandatoryField,
          });
        }

        if (new Date(departureDateTime) < new Date(arrivalDateTime)) {
          ctx.addIssue({
            path: ['departureDateTime'],
            code: 'custom',
            message: 'The departure date must be later than the arrival date.',
          });
        }

        if (!departure) {
          ctx.addIssue({
            path: ['departure'],
            code: 'custom',
            message: mandatoryField,
          });
        }
      }
    },
  );

export type EventFormInput = z.input<typeof EventFormSchema>;
