# Google Service Account Keys

This directory contains the Google Service Account key file required for Google Sheets API access.

## Required File

Place your Google Service Account JSON key file here as:
```
keys/abecmed-368dfd6bae7c.json
```

## Security Note

🔒 **IMPORTANT**: This file contains sensitive credentials. 

- **DO NOT** commit this file to version control
- **DO NOT** share this file publicly
- Keep it secure and private

## File Structure Expected

```
keys/
└── abecmed-368dfd6bae7c.json  ← Your Google Service Account key file
```

## Environment Variable

The application is configured to use:
```
GOOGLE_APPLICATION_CREDENTIALS=keys/abecmed-368dfd6bae7c.json
```

## Getting the Key File

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Select your service account
4. Go to **Keys** tab → **Add Key** → **Create new key**
5. Choose **JSON** format
6. Save as `abecmed-368dfd6bae7c.json` in this directory 