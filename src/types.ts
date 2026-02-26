export interface Event {
  id: string;
  name: string;
  date?: string;
  location?: string;
}

export interface ZohoEvent {
  id: string;
  Name: string;
  Data_Ora?: string;
  Locatie?: string;
  Data_Ora_Incheiere_Eveniment?: string;
  Capacitate?: number;
  Tip_Eveniment?: string;
  Status?: string;
}

export interface Participant {
  id: string;
  participant_id: string;
  contact_id?: string;
  nume?: string;
  prenume?: string;
  email?: string;
  telefon?: string;
  checked_in?: boolean;
  full_name?: string;
  categorie?: string;
  subcategorie?: string;
  status_invitatie?: string | null;
}

export interface CreateParticipantData {
  nume: string;
  prenume: string;
  email: string;
  functie?: string;
  email_personal?: string;
  phone?: string;
  telefon?: string;
  validat_pmt?: string;
  ierarhia?: string;
  domeniu_activitate?: string;
  categorie?: string;
  subcategorie?: string;
  formula_adresare?: string;
  adresa_corespondenta?: string;
  observatii?: string;
  domenii_interes?: string;
  event_id: string;
}

export interface ApiConfig {
  getEventsUrl: string;
  getParticipantsUrl: string;
  checkInUrl: string;
  createParticipantUrl: string;
}
