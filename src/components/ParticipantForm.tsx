import { useState, useEffect } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { Participant, Event } from '../types';
import { apiService } from '../services/api';

interface ParticipantFormProps {
  event: Event;
  participant?: Participant;
  onClose: () => void;
  onSuccess: () => void;
}

export function ParticipantForm({ event, participant, onClose, onSuccess }: ParticipantFormProps) {
  const [formData, setFormData] = useState({
    nume: '',
    prenume: '',
    email: '',
    functie: '',
    email_personal: '',
    phone: '',
    telefon: '',
    validat_pmt: '',
    ierarhia: '',
    domeniu_activitate: '',
    categorie: '',
    subcategorie: '',
    formula_adresare: '',
    adresa_corespondenta: '',
    observatii: '',
    domenii_interes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (participant?.contact_id) {
      setFormData({
        nume: participant.nume || '',
        prenume: participant.prenume || '',
        email: participant.email || '',
        functie: '',
        email_personal: '',
        phone: '',
        telefon: participant.telefon || '',
        validat_pmt: '',
        ierarhia: '',
        domeniu_activitate: '',
        categorie: participant.categorie || '',
        subcategorie: participant.subcategorie || '',
        formula_adresare: '',
        adresa_corespondenta: '',
        observatii: '',
        domenii_interes: '',
      });
    }
  }, [participant]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nume.trim()) {
      newErrors.nume = 'Numele este obligatoriu';
    }

    if (!formData.prenume.trim()) {
      newErrors.prenume = 'Prenumele este obligatoriu';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email-ul nu este valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await apiService.createParticipant({
        ...formData,
        event_id: event.id,
      });
      onSuccess();
    } catch (err) {
      console.error('Error creating participant:', err);
      alert('Failed to add participant. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {participant?.contact_id ? 'Adauga Participant' : 'Participant Nou'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">{event.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nume" className="block text-sm font-medium text-slate-700 mb-2">
              Nume <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nume"
              value={formData.nume}
              onChange={(e) => handleChange('nume', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.nume
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              placeholder="Popescu"
            />
            {errors.nume && (
              <p className="mt-1 text-sm text-red-600">{errors.nume}</p>
            )}
          </div>

          <div>
            <label htmlFor="prenume" className="block text-sm font-medium text-slate-700 mb-2">
              Prenume <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="prenume"
              value={formData.prenume}
              onChange={(e) => handleChange('prenume', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.prenume
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              placeholder="Ion"
            />
            {errors.prenume && (
              <p className="mt-1 text-sm text-red-600">{errors.prenume}</p>
            )}
          </div>

          <div>
            <label htmlFor="functie" className="block text-sm font-medium text-slate-700 mb-2">
              Functie
            </label>
            <input
              type="text"
              id="functie"
              value={formData.functie}
              onChange={(e) => handleChange('functie', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Director General"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              placeholder="ion.popescu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="email_personal" className="block text-sm font-medium text-slate-700 mb-2">
              Email personal
            </label>
            <input
              type="email"
              id="email_personal"
              value={formData.email_personal}
              onChange={(e) => handleChange('email_personal', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ion@personal.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+40712345678"
            />
          </div>

          <div>
            <label htmlFor="telefon" className="block text-sm font-medium text-slate-700 mb-2">
              Telefon
            </label>
            <input
              type="tel"
              id="telefon"
              value={formData.telefon}
              onChange={(e) => handleChange('telefon', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+40712345678"
            />
          </div>

          <div>
            <label htmlFor="domeniu_activitate" className="block text-sm font-medium text-slate-700 mb-2">
              Domeniu de activitate
            </label>
            <input
              type="text"
              id="domeniu_activitate"
              value={formData.domeniu_activitate}
              onChange={(e) => handleChange('domeniu_activitate', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="categorie" className="block text-sm font-medium text-slate-700 mb-2">
              Categorie
            </label>
            <input
              type="text"
              id="categorie"
              value={formData.categorie}
              onChange={(e) => handleChange('categorie', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="subcategorie" className="block text-sm font-medium text-slate-700 mb-2">
              Subcategorie
            </label>
            <input
              type="text"
              id="subcategorie"
              value={formData.subcategorie}
              onChange={(e) => handleChange('subcategorie', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="formula_adresare" className="block text-sm font-medium text-slate-700 mb-2">
              Formula de adresare
            </label>
            <input
              type="text"
              id="formula_adresare"
              value={formData.formula_adresare}
              onChange={(e) => handleChange('formula_adresare', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="adresa_corespondenta" className="block text-sm font-medium text-slate-700 mb-2">
              Adresa de corespondenta
            </label>
            <textarea
              id="adresa_corespondenta"
              value={formData.adresa_corespondenta}
              onChange={(e) => handleChange('adresa_corespondenta', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div>
            <label htmlFor="observatii" className="block text-sm font-medium text-slate-700 mb-2">
              Observatii
            </label>
            <textarea
              id="observatii"
              value={formData.observatii}
              onChange={(e) => handleChange('observatii', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Anuleaza
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                submitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'hover:bg-blue-700 active:scale-95'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Se adauga...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Adauga</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
