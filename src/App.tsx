import { useState, useEffect } from 'react';
import { EventSelection } from './components/EventSelection';
import { ParticipantList } from './components/ParticipantList';
import { ParticipantForm } from './components/ParticipantForm';
import { Event, Participant } from './types';
import { apiService } from './services/api';

type Screen = 'events' | 'participants' | 'form';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('events');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);


  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setCurrentScreen('participants');
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setCurrentScreen('events');
  };

  const handleAddParticipant = (participant?: Participant) => {
    setSelectedParticipant(participant);
    setCurrentScreen('form');
  };

  const handleCloseForm = () => {
    setSelectedParticipant(undefined);
    setCurrentScreen('participants');
  };

  const handleFormSuccess = () => {
    setSelectedParticipant(undefined);
    setCurrentScreen('participants');
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      {currentScreen === 'events' && (
        <EventSelection onSelectEvent={handleSelectEvent} />
      )}

      {(currentScreen === 'participants' || currentScreen === 'form') && selectedEvent && (
        <ParticipantList
          key={refreshKey}
          event={selectedEvent}
          onBack={handleBackToEvents}
          onAddParticipant={handleAddParticipant}
        />
      )}

      {currentScreen === 'form' && selectedEvent && (
        <ParticipantForm
          event={selectedEvent}
          participant={selectedParticipant}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
}

export default App;
