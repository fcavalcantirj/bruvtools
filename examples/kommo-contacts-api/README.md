# Kommo Contacts API

An Express.js API for searching WhatsApp numbers in Kommo CRM with intelligent Brazilian phone number formatting support.

## 🎯 Purpose

This API serves as a bridge between WhatsApp numbers and Kommo CRM, enabling efficient customer lookup with smart phone number matching. It's specifically designed to handle Brazilian phone number variations and formatting inconsistencies.

**Workflow**: WhatsApp Number → API Search → Kommo CRM Lookup → Customer Match

## Features

- 🔍 **Smart Phone Search**: Search both contacts and leads in Kommo CRM
- 🇧🇷 **Brazilian Phone Formatting**: Intelligent handling of extra 9 digit in mobile numbers
- 🔄 **Fallback Search**: Tries original number first, then modified version
- 📱 **Country Code Handling**: Automatically handles +55 country code variations
- 🎯 **Multi-Entity Search**: Searches both contacts and leads simultaneously
- 📊 **Detailed Responses**: Returns entity type, ID, and matched phone number
- ⚡ **Fast Lookup**: Optimized search with configurable limits

## Requirements

- Node.js 16+
- NPM or Yarn package manager
- **Kommo CRM account** with API access
- **Kommo API credentials** (Base URL and Access Token)

## Installation

1. Navigate to the project directory:
   ```bash
   cd kommo-contacts-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (see Configuration section)

## Configuration

### For CapRover Deployment (Recommended)

This API is designed to be deployed with bruvtools to CapRover. Environment variables are set through the CapRover dashboard:

1. **Deploy the app:**
   ```bash
   bruvtools deploy kommo-contacts-api
   ```

2. **Set environment variables in CapRover dashboard:**
   - Go to your CapRover dashboard
   - Navigate to Apps → kommo-contacts-api → App Configs
   - Add the following environment variables:

### Required Environment Variables:

- **`KOMMO_BASE_URL`** - Your Kommo CRM API base URL (e.g., `https://your-domain.kommo.com/api/v4`)
- **`KOMMO_ACCESS_TOKEN`** - Your Kommo API access token

### Optional Environment Variables:

- **`PORT`** - Port number for the API server (defaults to 80 for CapRover)

### For Local Development

If running locally for development, you can set environment variables directly:

```bash
export KOMMO_BASE_URL=https://your-domain.kommo.com/api/v4
export KOMMO_ACCESS_TOKEN=your_access_token_here
export PORT=3000
```

Or use a `.env` file (not committed to version control):
```bash
KOMMO_BASE_URL=https://your-domain.kommo.com/api/v4
KOMMO_ACCESS_TOKEN=your_access_token_here
PORT=3000
```

## Usage

### Starting the Server

**Option 1: Using Launcher Script (Recommended)**

From the project root directory:
```bash
python run_kommo_api.py
```
*This automatically installs dependencies and starts the server*

**Option 2: Direct Execution**

**Production:**
```bash
cd kommo-contacts-api
npm install
npm start
```

**Development (with auto-reload):**
```bash
cd kommo-contacts-api
npm install
npm run dev
```

### API Endpoint

**Search WhatsApp Number:**
```
GET /search-whatsapp?number=<phone_number>
```

### Examples

**Basic Search:**
```bash
curl "http://localhost:3000/search-whatsapp?number=5511999887766"
```

**With Country Code:**
```bash
curl "http://localhost:3000/search-whatsapp?number=+5511999887766"
```

**Formatted Number:**
```bash
curl "http://localhost:3000/search-whatsapp?number=(11) 99988-7766"
```

### Response Format

**Success Response:**
```json
{
  "entity": "contacts",
  "id": 12345,
  "fullWhatsapp": "+5511999887766",
  "searched": "11999887766",
  "modified": false
}
```

**Success with Number Modification:**
```json
{
  "entity": "leads", 
  "id": 67890,
  "fullWhatsapp": "+551199887766",
  "searched": "11999887766",
  "modified": true,
  "used": "1199887766"
}
```

**Not Found Response:**
```json
{
  "error": "no match found",
  "searched": "11999887766"
}
```

## Brazilian Phone Number Logic

The API includes intelligent Brazilian phone number handling:

### Extra 9 Digit Removal

Brazilian mobile numbers sometimes include an extra 9 digit that needs to be removed for matching:

- **11-digit number**: `11999887766` (DDD + 9 + 8 digits)
- **Checks position 3**: If it's a 9, removes it
- **Result**: `1199887766` (DDD + 8 digits)

### Country Code Handling

- **Removes +55** country code for core number comparison
- **Handles variations**: `+5511999887766`, `5511999887766`, `11999887766`
- **Normalizes for matching**: All variations match the same core number

## Search Strategy

The API uses a two-phase search strategy:

### Phase 1: Original Number
1. Search contacts with original number
2. Search leads with original number
3. Return first match found

### Phase 2: Modified Number (if no match)
1. Try to remove extra 9 digit (if applicable)
2. Search contacts with modified number
3. Search leads with modified number
4. Return first match found

## Error Handling

### Common Error Responses:

**Missing Number Parameter:**
```json
{
  "error": "use ?number=<phone>"
}
```

**No Match Found:**
```json
{
  "error": "no match found",
  "searched": "11999887766"
}
```

### Server Errors:
- **500**: Kommo API connection issues
- **401**: Invalid Kommo access token
- **400**: Malformed request

## Troubleshooting

### Common Issues

1. **Environment Variables Missing**
   - Ensure all required environment variables are set
   - Check `.env` file exists and is properly formatted

2. **Kommo API Connection Errors**
   - Verify `KOMMO_BASE_URL` is correct
   - Check `KOMMO_ACCESS_TOKEN` is valid and not expired
   - Ensure network connectivity to Kommo servers

3. **No Results Found**
   - Verify phone numbers exist in Kommo CRM
   - Check phone number format in Kommo matches expected format
   - Try different number variations manually

4. **Server Won't Start**
   - Check if port is already in use
   - Verify Node.js version (requires 16+)
   - Check for missing dependencies (`npm install`)

### Debug Mode

The API includes console logging for debugging:
- Search attempts and results
- Phone number transformations
- Entity search results
- Match comparisons

## Development

### Project Structure

```
kommo-contacts-api/
├── index.js           # Main API server
├── package.json       # Node.js project configuration
├── README.md         # This file
└── .env              # Environment variables (not in git)
```

### Key Functions

- **`removeExtraNine(number)`** - Removes extra 9 from Brazilian mobile numbers
- **`sameNumber(found, searched)`** - Compares phone numbers with normalization
- **`queryKommo(entity, term)`** - Queries Kommo API for contacts/leads
- **`extractPhones(item)`** - Extracts phone numbers from Kommo response

### Adding Features

1. **New Search Logic**: Modify the search strategy in `/search-whatsapp` endpoint
2. **Additional Entities**: Add more entity types to search array
3. **Enhanced Formatting**: Extend `removeExtraNine` function for other patterns
4. **Caching**: Add Redis or memory caching for frequent searches

## Security Considerations

- **API Token**: Keep `KOMMO_ACCESS_TOKEN` secure and rotate regularly
- **Rate Limiting**: Consider adding rate limiting for production use
- **HTTPS**: Use HTTPS in production environments
- **Input Validation**: Phone numbers are sanitized but consider additional validation

## License

Internal tool for ABEC (Associação Brasileira de Estudos Canábicos). 