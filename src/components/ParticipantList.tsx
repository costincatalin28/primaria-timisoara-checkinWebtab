import { useEffect, useState } from 'react';
import { Search, UserCheck, UserPlus, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Event, Participant } from '../types';
import { apiService } from '../services/api';

interface ParticipantListProps {
  event: Event;
  onBack: () => void;
  onAddParticipant: (participant?: Participant) => void;
}

export function ParticipantList({ event, onBack, onAddParticipant }: ParticipantListProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  useEffect(() => {
    loadParticipants();
  }, [event.id]);

  useEffect(() => {
    filterParticipants();
  }, [searchQuery, participants]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await apiService.getParticipants(event.id);
      setParticipants(data);
      setFilteredParticipants(data);
    } catch (err) {
      console.error('Error loading participants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterParticipants = () => {
    if (!searchQuery.trim()) {
      setFilteredParticipants(participants);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = participants.filter((p) => {
      const fullName = `${p.prenume || ''} ${p.nume || ''}`.toLowerCase();
      const email = (p.email || '').toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });

    setFilteredParticipants(filtered);
  };

  const handleCheckIn = async (participantId: string) => {
    try {
      setCheckingIn(participantId);
      await apiService.checkIn(participantId);

      // Refresh participant data to get the updated status
      await loadParticipants();
    } catch (err) {
      console.error('Error checking in participant:', err);
      alert('Failed to check in participant. Please try again.');
    } finally {
      setCheckingIn(null);
    }
  };

  const checkedInCount = participants.filter((p) => p.checked_in).length;
  const totalCount = participants.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading participants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{event.name}</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-slate-600">
                  {checkedInCount} / {totalCount} checked in
                </p>
                <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-xs">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalCount > 0 ? (checkedInCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => onAddParticipant()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              Adauga Participant
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredParticipants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchQuery ? 'No participants found' : 'No participants yet'}
            </h3>
            <p className="text-slate-600">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Click "Adauga Participant" to get started'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className={`bg-white rounded-xl shadow-md p-5 transition-all ${
                  participant.checked_in
                    ? 'ring-2 ring-green-500 bg-green-50'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {participant.full_name || `${participant.prenume} ${participant.nume}`}
                    </h3>
                    <div className="flex items-center gap-2">
                      {participant.status_invitatie && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          participant.status_invitatie === 'Participat'
                            ? 'text-green-700 bg-green-100'
                            : 'text-amber-700 bg-amber-100'
                        }`}>
                          {participant.status_invitatie}
                        </span>
                      )}
                      {participant.checked_in && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  {participant.categorie && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {participant.categorie}
                      </span>
                      {participant.subcategorie && (
                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {participant.subcategorie}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleCheckIn(participant.participant_id)}
                  disabled={participant.checked_in || checkingIn === participant.participant_id}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    participant.checked_in
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : checkingIn === participant.participant_id
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                  }`}
                >
                  {checkingIn === participant.participant_id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {participant.checked_in ? 'Checked' : 'Check In'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
