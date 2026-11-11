import { useState } from 'react';
import { EventFormData } from '../../types';
import EventForm from './components/EventForm/EventForm';
import EventSummary from './components/EventSummary';

function Event() {
  const [viewSummary, setViewSummary] = useState(false);
  const [landingData, setLandingData] = useState<EventFormData>();

  const saveLandingData = (data: EventFormData) => {
    setLandingData(data);
    setViewSummary(true);
  };

  const onEditButtonClicked = () => {
    setViewSummary(false);
  };

  const onResetButtonClicked = () => {
    setLandingData(undefined);
    setViewSummary(false);
  };

  return (
    <div>
      {landingData && viewSummary ? (
        <EventSummary
          landingData={landingData}
          onEditButtonClicked={onEditButtonClicked}
          onResetButtonClicked={onResetButtonClicked}
        />
      ) : (
        <EventForm
          onLandingDataFiled={saveLandingData}
          initialData={landingData}
        />
      )}
    </div>
  );
}

export default Event;
