import { Event, Participant, CreateParticipantData, ZohoEvent } from '../types';

declare const ZOHO: any;

class ApiService {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve) => {
      ZOHO.embeddedApp.on('PageLoad', () => {
        console.log('Zoho SDK initialized');
        this.initialized = true;
        resolve();
      });

      ZOHO.embeddedApp.init();
    });
  }

  private transformZohoEvent(zohoEvent: any): Event {
    return {
      id: zohoEvent.id,
      name: zohoEvent.Name,
      date: zohoEvent.Data_Ora ? new Date(zohoEvent.Data_Ora).toISOString().split('T')[0] : undefined,
      location: zohoEvent.Locatie,
    };
  }

  async getEvents(): Promise<Event[]> {
    try {
      await this.init();

      const response = await ZOHO.CRM.API.getAllRecords({
        Entity: 'Evenimente__c',
        sort_order: 'desc',
        per_page: 200,
        page: 1,
      });

      console.log('Events response:', response);

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((event: any) => this.transformZohoEvent(event));
      }

      return [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async getParticipants(eventId: string): Promise<Participant[]> {
    try {
      await this.init();

      const response = await ZOHO.CRM.API.getAllRecords({
        Entity: 'Participanti_Evenimente__c',
        sort_order: 'desc',
        per_page: 200,
        page: 1,
      });

      console.log('Participants response:', response);

      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      const participants = response.data
        .filter((p: any) => p.Eveniment?.id === eventId)
        .map((p: any) => ({
          id: p.id,
          participant_id: p.id,
          contact_id: p.Contact?.id,
          nume: p.Nume,
          prenume: p.Prenume,
          email: p.Email,
          telefon: p.Telefon,
          checked_in: p.Status_Invitatie === 'Participat',
          full_name: p.Full_Name,
          categorie: p.Categorie,
          subcategorie: p.Subcategorie,
          status_invitatie: p.Status_Invitatie,
        }));

      return participants;
    } catch (error) {
      console.error('Error fetching participants:', error);
      throw error;
    }
  }

  async checkIn(participantId: string): Promise<void> {
    try {
      await this.init();

      const response = await ZOHO.CRM.API.updateRecord({
        Entity: 'Participanti_Evenimente__c',
        APIData: {
          id: participantId,
          Status_Invitatie: 'Participat',
        },
        Trigger: [],
      });

      console.log('Check-in response:', response);

      if (!response.data || response.data[0]?.code !== 'SUCCESS') {
        throw new Error('Failed to check in participant');
      }
    } catch (error) {
      console.error('Error checking in participant:', error);
      throw error;
    }
  }

  async createParticipant(data: CreateParticipantData): Promise<void> {
    try {
      await this.init();

      const apiData: any = {
        Nume: data.nume,
        Prenume: data.prenume,
        Email: data.email,
        Eveniment: {
          id: data.event_id,
        },
      };

      if (data.telefon || data.phone) {
        apiData.Telefon = data.telefon || data.phone;
      }
      if (data.categorie) apiData.Categorie = data.categorie;
      if (data.subcategorie) apiData.Subcategorie = data.subcategorie;
      if (data.functie) apiData.Functie = data.functie;
      if (data.email_personal) apiData.Email_Personal = data.email_personal;
      if (data.validat_pmt) apiData.Validat_PMT = data.validat_pmt;
      if (data.ierarhia) apiData.Ierarhia = data.ierarhia;
      if (data.domeniu_activitate) apiData.Domeniu_Activitate = data.domeniu_activitate;
      if (data.formula_adresare) apiData.Formula_Adresare = data.formula_adresare;
      if (data.adresa_corespondenta) apiData.Adresa_Corespondenta = data.adresa_corespondenta;
      if (data.observatii) apiData.Observatii = data.observatii;
      if (data.domenii_interes) apiData.Domenii_Interes = data.domenii_interes;

      const response = await ZOHO.CRM.API.insertRecord({
        Entity: 'Participanti_Evenimente__c',
        APIData: apiData,
        Trigger: [],
      });

      console.log('Create participant response:', response);

      if (!response.data || response.data[0]?.code !== 'SUCCESS') {
        throw new Error('Failed to create participant');
      }
    } catch (error) {
      console.error('Error creating participant:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
