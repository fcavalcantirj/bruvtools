const { PORT } = process.env

const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

const app = express()

// Add CORS middleware before other middleware
app.use(cors({
    origin: ['https://abecops.netlify.app', 'http://abecops.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-KEY', 'x-abec-token'],
    credentials: true
}));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// For JSON-encoded bodies
app.use(bodyParser.json({ limit: '50mb' }));

// For URL-encoded bodies
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const query = req.query;
  const headers = req.headers;
  const body = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`
🔍 Request Details:
⏰ Time: ${timestamp}
🌐 IP: ${ip}
📡 Method: ${method}
🔗 URL: ${url}
🔍 Query: ${JSON.stringify(query)}
📦 Body: ${JSON.stringify(body)}
🔑 Headers: ${JSON.stringify(headers)}
-------------------`);

  // Log response
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`
📤 Response Details:
⏰ Time: ${new Date().toISOString()}
🔗 URL: ${url}
📡 Method: ${method}
📦 Status: ${res.statusCode}
📦 Body: ${typeof body === 'string' ? body : JSON.stringify(body)}
-------------------`);
    return originalSend.call(this, body);
  };

  next();
});

// Add error logging middleware
app.use((err, req, res, next) => {
  console.error(`
❌ Error Details:
⏰ Time: ${new Date().toISOString()}
🔗 URL: ${req.url}
📡 Method: ${req.method}
❌ Error: ${err.message}
📚 Stack: ${err.stack}
-------------------`);
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// API Key validation
const expectedApiKey = 'adcd2e35-787d-4dd2-ba8c-76085a99d2a4';

function checkApiKey(req, res, next) {
    const apiKey = req.get('X-API-KEY');
    if (apiKey && apiKey === expectedApiKey) {
        next();
    } else {
        res.status(401).json({ error: 'Invalid or missing API key' });
    }
}

// Google Auth client creation
async function createGoogleAuthClient() {
    // Check if JSON credentials are provided via environment variable
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        const auth = new GoogleAuth({
            credentials: credentials,
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
        });
        return auth.getClient();
    }
    
    // Fallback to file-based credentials
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    });
    return auth.getClient();
}

// Health check endpoint
app.get("/healthcheck", async (req, res) => {
	res.status(200).json({ message: 'Patient Search Microservice OK' });
})

// Patient search endpoint
app.get('/patient-search', checkApiKey, async (req, res) => {
    const { cpf, mobile } = req.query;

    if (!cpf && !mobile) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Either CPF or mobile number is required' 
        });
    }

    // Normaliza CPF (remove tudo que não for dígito)
    const normalize = (value) => value.replace(/\D/g, '');

    // Normaliza telefone (remove DDI, nono dígito, etc)
    const normalizePhone = (phone) => {
        let normalized = phone.replace(/\D/g, '');
        if (normalized.startsWith('55')) {
            normalized = normalized.slice(2);
        }
        if (normalized.length === 11 && normalized[2] === '9') {
            normalized = normalized.slice(0, 2) + normalized.slice(3);
        }
        return normalized;
    };

    // Compara telefones normalizados
    const phonesMatch = (input, candidate) => {
        const a = normalizePhone(input || '');
        const b = normalizePhone(candidate || '');
        return a === b;
    };

    try {
        const authClient = await createGoogleAuthClient();
        const sheets = google.sheets({version: 'v4', auth: authClient});

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: '1OMt6CRGizSagKzfOmc64En7MCffPc9JnA1r6zqeR3C0',
            range: 'Sheet1',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return res.status(404).json({ 
                status: 'error',
                message: 'No data found in spreadsheet' 
            });
        }

        const headers = rows[0];
        const normalizedCpf = cpf ? normalize(cpf) : null;
        const normalizedMobile = mobile ? normalizePhone(mobile) : null;

        const patient = rows.find(row => {
            const rowCpf = row[headers.indexOf('CPF')] ? normalize(row[headers.indexOf('CPF')]) : '';
            const rowMobile = row[headers.indexOf('CONTATO_CLEANED')] ? row[headers.indexOf('CONTATO_CLEANED')] : '';
            return (
                (normalizedCpf && rowCpf === normalizedCpf) ||
                (normalizedMobile && phonesMatch(normalizedMobile, rowMobile))
            );
        });

        if (patient) {
            const patientData = headers.reduce((obj, header, index) => {
                const key = header === "-" ? "NAME" : header;
                obj[key] = patient[index];
                return obj;
            }, {});
            res.status(200).json({
                status: 'success',
                data: {
                    exists: true,
                    ...patientData
                }
            });
        } else {
            res.status(404).json({ 
                status: 'error',
                data: { exists: false },
                message: 'Patient not found' 
            });
        }
    } catch (error) {
        console.error('Error searching patient:', error);
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

// Start server
const microservicePort = PORT || 80;
app.listen(microservicePort, '0.0.0.0', () => console.log(`🚀 Patient Search Microservice running on port ${microservicePort}`)) 