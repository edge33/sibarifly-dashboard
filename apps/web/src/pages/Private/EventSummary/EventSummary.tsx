import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../../axios/axiosInstance';
import Summary from '../../../components/EventSummary/Summary';
import Spinner from '../../../components/Spinner';
import useHttp from '../../../hooks/useHttp';
import { EventData, EventFormData } from '../../../types';
import mapEventDataToFormData from '../../../utils/mapEventDataToFormData';

const eventsHandler = (eventId: string) =>
  instance.get(`/events/${eventId}`, { _retry: true });

const EventSummary = () => {
  const { data, trigger, pending } = useHttp<string, EventData>(eventsHandler);
  const [eventData, setEventData] = useState<EventFormData>();
  const params = useParams();
  const eventId = params.eventId;

  useEffect(() => {
    if (data) {
      setEventData(mapEventDataToFormData(data));
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      if (eventId) {
        await trigger(eventId);
      }
    })();
  }, [eventId, trigger]);

  return (
    <>
      {pending && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {eventData && <Summary eventData={eventData} />}

      {/* {error && !saveSuccess && (
        <div className="mt-6 print:hidden flex flex-col md:flex-row gap-4 sm:gap-6">
          <p className="text-red-500">Log save error</p>
        </div>
      )} */}

      <div className="mt-6 print:hidden flex flex-col md:flex-row gap-4 sm:gap-6">
        <button
          onClick={() => window.print()}
          type="submit"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
        >
          Print log
        </button>
      </div>
    </>
  );
};

export default EventSummary;
