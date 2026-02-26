# Event Check-In System for Zoho CRM

A mobile-friendly CRM view for managing event day check-ins, designed to be used as a Zoho CRM webtab. Perfect for laptops at event entrances.

## Features

- **Event Selection**: Choose from a list of available events
- **Confirmed Attendees List**: View all participants for the selected event
- **Search Functionality**: Quickly find participants by name or email
- **Check-In Button**: One-click check-in for each participant
- **Add Participant**: Create new participants with form prepopulation support
- **Mobile-Optimized**: Responsive design works on both mobile and laptop screens
- **Real-time Progress**: Visual progress bar showing check-in status

## How It Works

### 1. Event Selection Screen
- Displays all available events with dates and locations
- Click on an event to view its participant list

### 2. Participant List Screen
- Shows all confirmed attendees for the selected event
- Search bar for filtering by name or email
- Progress indicator showing checked-in vs total participants
- Two action buttons per participant:
  - **Check In**: Marks the participant as checked in
  - **Add**: Opens form to add a new participant (prepopulated if contact exists)

### 3. Add Participant Form
- Fields: Nume (Last Name), Prenume (First Name), Email, Telefon (Phone)
- All fields are required with validation
- Automatically prepopulates if the participant has a contact ID
- Form is in Romanian language

## API Configuration

The application uses dummy data by default for demonstration. To connect to your actual endpoints, modify the API configuration in `src/services/api.ts`:

```typescript
apiService.setConfig({
  getEventsUrl: 'YOUR_GET_EVENTS_ENDPOINT',
  getParticipantsUrl: 'YOUR_GET_PARTICIPANTS_ENDPOINT',
  checkInUrl: 'YOUR_CHECK_IN_ENDPOINT',
  createParticipantUrl: 'YOUR_CREATE_PARTICIPANT_ENDPOINT',
});
```

### Expected API Formats

#### Get Events Endpoint
**Request**: GET request
**Response**: Array of events
```json
[
  {
    "id": "string",
    "name": "string",
    "date": "string (optional)",
    "location": "string (optional)"
  }
]
```

#### Get Participants Endpoint
**Request**: GET request with `event_id` query parameter
**Response**: Array of participants
```json
[
  {
    "id": "string",
    "participant_id": "string",
    "contact_id": "string (optional)",
    "nume": "string",
    "prenume": "string",
    "email": "string",
    "telefon": "string",
    "checked_in": "boolean"
  }
]
```

#### Check-In Endpoint
**Request**: POST request
```json
{
  "participant_id": "string"
}
```

#### Create Participant Endpoint
**Request**: POST request
```json
{
  "nume": "string",
  "prenume": "string",
  "email": "string",
  "telefon": "string",
  "event_id": "string"
}
```

## Zoho CRM Integration

This application is designed to work as a Zoho CRM webtab:

1. Build the project: `npm run build`
2. Host the `dist` folder on a web server
3. Add the hosted URL as a webtab in Zoho CRM
4. The application will automatically initialize the Zoho SDK

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- Zoho CRM JS SDK for integration

## Design Features

- Clean, modern interface with gradient backgrounds
- Card-based layout for easy scanning
- Color-coded check-in status (green for checked in)
- Smooth transitions and hover effects
- Mobile-first responsive design
- Loading states and error handling
