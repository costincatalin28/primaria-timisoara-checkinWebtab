import { useEffect, useState } from 'react';
import { Calendar, MapPin, Loader2, Search } from 'lucide-react';
import { Event } from '../types';
import { apiService } from '../services/api';

interface EventSelectionProps {
  onSelectEvent: (event: Event) => void;
}

export function EventSelection({ onSelectEvent }: EventSelectionProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, events]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('EventSelection: Starting to load events...');
      const data = await apiService.getEvents();
      console.log('EventSelection: Received events data:', data);
      console.log('EventSelection: Number of events:', data.length);
      setEvents(data);
      setFilteredEvents(data);
      console.log('EventSelection: State updated with events');
    } catch (err) {
      console.error('EventSelection: Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = events.filter((event) => {
      const name = (event.name || '').toLowerCase();
      const location = (event.location || '').toLowerCase();
      return name.includes(query) || location.includes(query);
    });

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Events</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={loadEvents}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Event Check-In</h1>
          <p className="text-slate-600 mb-6">Select an event to manage attendees</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-left group hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Calendar className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {event.name}
              </h3>

              {event.date && (
                <div className="flex items-center text-slate-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {new Date(event.date).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.location}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredEvents.length === 0 && events.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Events Found</h3>
            <p className="text-slate-600">Try adjusting your search criteria</p>
          </div>
        )}

        {events.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Events Available</h3>
            <p className="text-slate-600">There are no events scheduled at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
