# Deploying to Zoho CRM as a Web Tab

This application now uses the Zoho CRM JavaScript SDK directly and can be uploaded as a Web Tab widget in Zoho CRM.

## Prerequisites

1. A Zoho CRM account with appropriate permissions
2. Custom modules already set up:
   - `Evenimente__c` (Events)
   - `Participanti_Evenimente__c` (Participants)

## Deployment Steps

### 1. Build the Application

```bash
npm run build
```

This creates a production build in the `dist/` folder.

### 2. Upload as a Web Tab in Zoho CRM

#### Option A: Using Zoho CRM UI

1. Go to **Settings** > **Customization** > **Modules and Fields**
2. Select the module where you want to add the tab (e.g., Evenimente__c)
3. Click on **Links** or **Web Tabs**
4. Click **Add Web Tab**
5. Upload the contents of the `dist/` folder or host it on a web server and provide the URL

#### Option B: Using Zoho Extension (Recommended for Complex Apps)

1. Install Zoho CLI (`zet`):
   ```bash
   npm install -g zoho-extension-toolkit
   ```

2. Create a new extension project:
   ```bash
   zet init
   ```

3. Copy the contents of the `dist/` folder to the extension's `app/` directory

4. Update `plugin-manifest.json` with your client details

5. Pack and upload:
   ```bash
   zet pack
   ```

6. Upload the generated zip file in **Settings** > **Developer Space** > **Extensions**

### 3. Configure API Permissions

Ensure the extension/web tab has the following API scopes:
- `ZohoCRM.modules.custom.READ`
- `ZohoCRM.modules.custom.CREATE`
- `ZohoCRM.modules.custom.UPDATE`
- `ZohoCRM.modules.Evenimente__c.ALL`
- `ZohoCRM.modules.Participanti_Evenimente__c.ALL`

## Application Features

The application provides:
1. **Event Selection** - Browse and select events from the Evenimente__c module
2. **Participant Management** - View all participants for a selected event
3. **Check-in Functionality** - Mark participants as "Participat" (attended)
4. **Add Participants** - Create new participant records linked to events
5. **Search** - Search participants by name or email

## Technical Details

### Zoho SDK Integration

The application uses the Zoho Embedded App SDK loaded via CDN:
```html
<script src="https://live.zwidgets.com/js-sdk/1.2/ZohoEmbededAppSDK.min.js"></script>
```

### API Methods Used

- `ZOHO.embeddedApp.init()` - Initialize the SDK
- `ZOHO.embeddedApp.on('PageLoad')` - Event listener for SDK initialization
- `ZOHO.CRM.API.getAllRecords()` - Fetch events and participants with pagination
  - Parameters: `Entity`, `sort_order`, `per_page`, `page`
- `ZOHO.CRM.API.insertRecord()` - Create new participants
  - Parameters: `Entity`, `APIData`, `Trigger`
  - Lookup fields (like Eveniment) must be passed as objects with `id` property
- `ZOHO.CRM.API.updateRecord()` - Update participant status during check-in
  - Parameters: `Entity`, `APIData` (including record `id`), `Trigger`

### Module Structure

- **Evenimente__c** fields used:
  - `Name` - Event name
  - `Data_Ora` - Event date/time
  - `Locatie` - Event location

- **Participanti_Evenimente__c** fields used:
  - `Nume` - Last name
  - `Prenume` - First name
  - `Email` - Email address
  - `Telefon` - Phone number
  - `Status_Invitatie` - Status (used for check-in)
  - `Categorie` - Category
  - `Subcategorie` - Subcategory
  - `Eveniment` - Link to event record

## Troubleshooting

### SDK Not Loading
- Ensure the Zoho SDK script is loaded before your application code
- Check browser console for CORS or loading errors

### API Calls Failing
- Verify API permissions in the extension/web tab settings
- Check that custom module API names match exactly (case-sensitive)
- Ensure the application is loaded within Zoho CRM context

### No Data Showing
- Confirm that the custom modules exist and contain data
- Check field API names match the code
- Look at browser console logs for detailed error messages

## Support

For issues related to:
- **Zoho CRM SDK**: https://www.zoho.com/crm/developer/docs/javascript-sdk/
- **Web Tabs**: https://www.zoho.com/crm/developer/docs/widgets/
- **Extensions**: https://www.zoho.com/crm/developer/docs/extensions/
