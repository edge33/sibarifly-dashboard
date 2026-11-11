import { EventFormData, STOP } from '../../types';

const EVENT_MAP = {
  ARRIVAL: 'Arrival',
  DEPARTURE: 'Departure',
  STOP: 'Fuel stop',
};

type SummaryProps = {
  eventData: EventFormData;
};

const Summary = ({ eventData }: SummaryProps) => {
  const {
    departureDateTime,
    arrivalDateTime,
    aircraftType,
    emailAddress,
    eventType,
    mobilePhone,
    aircraftRegistration,
    departure,
    destination,
    aircraftModel,
    paxNumber,
    pilotInCommand,
    firstOfficer,
  } = eventData;

  const isStop = eventType === STOP;

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900 print:text-gray-900 dark:text-white sm:text-2xl flex gap-4">
        <img
          src="/SibaryFlyLogo.png"
          className="h-8 hidden print:block"
          alt="club-logo"
        />
        {EVENT_MAP[eventType]} log
      </h2>
      <div className="flex flex-col gap-6 mt-8 md:sm-6 border-b border-t border-gray-200 py-8 dark:border-gray-700">
        {isStop ? (
          <div className="grid print:grid-cols-3 md:grid-cols-3 gap-8 print:justify-between md:justify-between">
            <dl>
              <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
                Arrival date and time
              </dt>
              <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
                {new Date(arrivalDateTime).toLocaleString()}
              </dd>
            </dl>
            <dl />
            <dl>
              <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
                Departure date and time
              </dt>
              <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
                {new Date(departureDateTime).toLocaleString()}
              </dd>
            </dl>
          </div>
        ) : (
          <div className="grid print:grid-cols-3 md:grid-cols-3 gap-8 print:justify-between md:justify-between">
            <dl>
              <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
                Date and time
              </dt>
              <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
                {new Date(arrivalDateTime).toLocaleString()}
              </dd>
            </dl>
          </div>
        )}

        <div className="grid print:grid-cols-3 md:grid-cols-3 gap-8 print:justify-between md:justify-between">
          <dl>
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Registration mark
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {aircraftRegistration}
            </dd>
          </dl>
          <dl>
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Aircraft model
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {aircraftModel}
            </dd>
          </dl>
          <dl>
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Aircraft type
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {aircraftType}
            </dd>
          </dl>
        </div>

        <div className="grid print:grid-cols-3 md:grid-cols-3 gap-8 print:justify-between md:justify-between">
          <dl>
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Pilot in command
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {pilotInCommand}
            </dd>
          </dl>
          <dl>
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              First office
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {firstOfficer}
            </dd>
          </dl>
          <dl>
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Number of passengers
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {paxNumber}
            </dd>
          </dl>
        </div>
        <div className="grid print:grid-cols-3 md:grid-cols-3 gap-8 print:justify-between md:justify-between">
          <dl>
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Departure airfield
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {departure}
            </dd>
          </dl>
          <dl className="print:col-start-3 md:col-start-3">
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Destination airfield
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {destination}
            </dd>
          </dl>
        </div>

        <div className="grid print:justify-between print:grid-cols-3 md:grid-cols-3 md:justify-between gap-8">
          <dl>
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Phone number
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {mobilePhone}
            </dd>
          </dl>
          <dl className="print:col-start-3 md:col-start-3">
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Email address
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400">
              {emailAddress}
            </dd>
          </dl>
        </div>

        <div className="hidden print:grid print:justify-between print:grid-cols-3 md:grid-cols-3 md:justify-between gap-8">
          <dl>
            <dt className="text-base font-medium text-gray-900 print:text-gray-900 dark:text-white">
              Signature
            </dt>
            <dd className="mt-1 text-base font-normal text-gray-500 print:text-gray-500 dark:text-gray-400"></dd>
          </dl>
        </div>
      </div>
    </>
  );
};

export default Summary;
