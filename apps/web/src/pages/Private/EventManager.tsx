import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../../axios/axiosInstance';
import useHttp from '../../hooks/useHttp';
// import TableControls from './components/TableControls';
// import TableFooter from './components/TableFooter';
import { EventData } from '../../types';
import TableHeader from './components/TableHader';
import TableRow from './components/TableRow';

const eventsHandler = () => instance.get('/events', { _retry: true });

const EventManager = () => {
  const navigate = useNavigate();
  const { data, trigger } = useHttp<null, EventData[]>(eventsHandler);
  useEffect(() => {
    trigger(null);
  }, [trigger]);

  const editEvent = (id: number) => {
    navigate(`/events/${id}`);
  };

  return (
    <>
      <section>
        <div className="">
          {/* Start coding here */}
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            {/* <TableControls /> */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <TableHeader />
                <tbody>
                  {data?.map(event => (
                    <TableRow key={event.id} {...event} editEvent={editEvent} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* <TableFooter /> */}
        </div>
      </section>
    </>
  );
};

export default EventManager;
