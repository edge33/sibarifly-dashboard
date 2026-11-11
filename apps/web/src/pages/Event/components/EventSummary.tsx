import { useState } from 'react';
import instance from '../../../axios/axiosInstance';
import Summary from '../../../components/EventSummary/Summary';
import Spinner from '../../../components/Spinner';
import { EventData, EventFormData, STOP } from '../../../types';

type SummaryProps = {
  landingData: EventFormData;
  onEditButtonClicked: () => void;
  onResetButtonClicked: () => void;
};

const EventSummary = ({
  landingData,
  onEditButtonClicked,
  onResetButtonClicked,
}: SummaryProps) => {
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
  } = landingData;

  const [saveSuccess, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  const postLandingData = async () => {
    if (pending) {
      return;
    }

    setPending(true);
    const events: EventData[] = [];
    setError(false);

    if (eventType === STOP) {
      events.push({
        dateTime: new Date(arrivalDateTime).toUTCString(),
        eventType: 'ARRIVAL',
        aircraftType,
        aircraftRegistration,
        aircraftModel,
        pilotInCommand,
        firstOfficer,
        paxNumber,
        departure,
        destination: 'Sibari',
        mobilePhone,
        emailAddress,
      });
      events.push({
        dateTime: new Date(departureDateTime).toUTCString(),
        eventType: 'DEPARTURE',
        aircraftType,
        aircraftRegistration,
        aircraftModel,
        pilotInCommand,
        firstOfficer,
        paxNumber,
        departure: 'Sibari',
        destination,
        mobilePhone,
        emailAddress,
      });
    } else {
      events.push({
        dateTime: new Date(arrivalDateTime).toUTCString(),
        eventType,
        aircraftType,
        aircraftRegistration,
        aircraftModel,
        pilotInCommand,
        firstOfficer,
        paxNumber,
        departure,
        destination,
        mobilePhone,
        emailAddress,
      });
    }

    try {
      await Promise.all(events.map(event => instance.post('/events', event)));
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(true);
    }

    setPending(false);
  };

  return (
    <>
      <Summary eventData={landingData} />

      {error && !saveSuccess && (
        <div className="mt-6 print:hidden flex flex-col md:flex-row gap-4 sm:gap-6">
          <p className="text-red-500">Log save error</p>
        </div>
      )}

      <div className="mt-6 print:hidden flex flex-col md:flex-row gap-4 sm:gap-6">
        {!saveSuccess && (
          <button
            disabled={pending}
            onClick={postLandingData}
            type="submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Save log
          </button>
        )}
        {pending && (
          <div className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white">
            <Spinner />
          </div>
        )}

        {!pending && saveSuccess && (
          <button
            onClick={() => window.print()}
            type="submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Print log
          </button>
        )}
        {!pending && !saveSuccess && (
          <button
            onClick={onEditButtonClicked}
            type="button"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-gray-900 print:text-gray-900 focus:outline-hidden bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Edit
          </button>
        )}
        {!pending && (
          <button
            onClick={onResetButtonClicked}
            type="button"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-gray-900 print:text-gray-900 focus:outline-hidden bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            New log
          </button>
        )}
      </div>
    </>
  );
};

export default EventSummary;
