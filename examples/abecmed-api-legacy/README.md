# ABEC Med API Legacy - Patient Search Microservice

A Node.js microservice for searching patients by CPF or mobile number using Google Sheets integration.

## 🏥 Overview

This microservice provides patient lookup functionality for ABEC Med healthcare operations, allowing secure patient verification through CPF (Brazilian tax ID) or mobile phone numbers. The service integrates with Google Sheets as the data source and includes sophisticated Brazilian phone number handling.

## 🚀 Features

- **Patient Search**: Search by CPF or mobile number
- **Google Sheets Integration**: Real-time data from Google Sheets
- **Brazilian Phone Formatting**: Advanced phone number normalization
- **API Key Authentication**: Secure access control
- **CORS Support**: Configured for ABEC Ops frontend
- **Comprehensive Logging**: Detailed request/response tracking
- **Health Check**: Endpoint for service monitoring

## 📊 API Endpoints

### Health Check
```bash
GET /healthcheck
```
**Response:**
```json
{ "message": "Patient Search Microservice OK" }
```

### Patient Search
```bash
# Search by CPF
curl -X GET "https://your-app.your-domain.com/patient-search?cpf=024.804.267-00" \
  -H "X-API-KEY: adcd2e35-787d-4dd2-ba8c-76085a99d2a4"

# Search by mobile number
curl -X GET "https://your-app.your-domain.com/patient-search?mobile=11987654321" \
  -H "X-API-KEY: adcd2e35-787d-4dd2-ba8c-76085a99d2a4"
```

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "exists": true,
    "NAME": "PATIENT FULL NAME",
    "DATA NASC": "9/6/1983",
    "CPF": "024.804.267-00",
    "MEDICO_CORRECTED": "Doctor Name",
    "CONTATO": "5521987654321",
    "CONTATO_CLEANED": "5521987654321",
    "ADMITIDO?": "ATIVO",
    "LOGIN": "patient@email.com",
    "MATRICULA": "296"
  }
}
```

**Patient Not Found:**
```json
{
  "status": "error",
  "data": { "exists": false },
  "message": "Patient not found"
}
```

**Invalid API Key:**
```json
{
  "error": "Invalid or missing API key"
}
```

## 🔧 Environment Variables

- `PORT`: Server port (default: 80)
- `NODE_ENV`: Environment mode (development/production)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Service Account key file (default: `keys/abecmed-368dfd6bae7c.json`)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: Alternative JSON credentials via environment variable

## 🔑 Google Service Account Setup

### Required File
Place your Google Service Account JSON key file as:
```
keys/abecmed-368dfd6bae7c.json
```

### Steps to Get the Key File
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Select your service account (or create one)
4. Go to **Keys** tab → **Add Key** → **Create new key**
5. Choose **JSON** format
6. Save as `abecmed-368dfd6bae7c.json` in the `keys/` directory

### Grant Spreadsheet Access
- Open the Google Sheet with your patient data
- Click **"Share"** and add the service account email
- Grant **"Viewer"** or **"Editor"** permissions

## 🐳 Deployment with Bruvtools

### Prerequisites
- Bruvtools CLI installed
- CapRover instance configured
- Google Service Account key file in `keys/` directory

### Deploy Steps

1. **Place the Google Service Account key:**
   ```bash
   # Ensure your key file is in the correct location
   ls keys/abecmed-368dfd6bae7c.json
   ```

2. **Create the app:**
   ```bash
   bruvtools create abecmed-api-legacy
   ```

3. **Deploy the service:**
   ```bash
   bruvtools deploy abecmed-api-legacy --directory examples/abecmed-api-legacy --port 80
   ```

### Manual Deployment
```bash
cd examples/abecmed-api-legacy
npm install
npm start
```

## 🔐 Security Features

- API Key validation on protected endpoints (`X-API-KEY` header required)
- CORS configuration for specific domains
- Security headers (HSTS, X-Content-Type-Options, X-Frame-Options, CSP)
- Non-root user in Docker container
- Input sanitization and validation
- Google Service Account authentication

## 📱 Phone Number Handling

The service includes sophisticated Brazilian phone number normalization:
- Removes country code (55)
- Handles 9th digit in mobile numbers
- Converts 11-digit to 10-digit format when appropriate
- Flexible matching for different formats

**Examples:**
- `5521987654321` → `21987654321`
- `21987654321` → `2187654321` (removes 9th digit)
- `+5521987654321` → `21987654321`

## 🗂️ Data Source

- **Google Sheets**: Patient database
- **Spreadsheet ID**: Configured via Google Service Account
- **Key Columns**: `CPF`, `CONTATO_CLEANED`, patient data fields

## 🔍 Logging

Comprehensive logging includes:
- Request/response details with timestamps
- IP addresses and headers
- Error tracking with stack traces
- Performance monitoring data
- Security scan attempts

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

## 🧪 Testing Examples

### Health Check
```bash
curl https://your-app.your-domain.com/healthcheck
```

### Patient Search with CPF
```bash
curl -X GET "https://your-app.your-domain.com/patient-search?cpf=024.804.267-00" \
  -H "X-API-KEY: adcd2e35-787d-4dd2-ba8c-76085a99d2a4" \
  -H "Content-Type: application/json"
```

### Patient Search with Mobile
```bash
curl -X GET "https://your-app.your-domain.com/patient-search?mobile=21987654321" \
  -H "X-API-KEY: adcd2e35-787d-4dd2-ba8c-76085a99d2a4" \
  -H "Content-Type: application/json"
```

## 📝 License

UNLICENSED - Private use only

## 👥 Author

ABEC Med

---

**Note**: This is a legacy service maintained for backward compatibility. For new implementations, consider the modernized patient search API. 