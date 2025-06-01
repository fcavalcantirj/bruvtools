const express = require('express');

const app = express();

// Universal function to reconstruct split environment variables
function getEnvVar(varName) {
  // First try to get the variable directly
  if (process.env[varName]) {
    console.log(`Found direct env var: ${varName}`);
    return process.env[varName];
  }
  
  // If not found, try to reconstruct from split parts
  let reconstructed = '';
  let partIndex = 1;
  
  while (true) {
    const partName = `${varName}_${partIndex}`;
    const part = process.env[partName];
    
    if (part) {
      console.log(`Found part ${partIndex}: ${partName} (${part.length} chars)`);
      reconstructed += part;
      partIndex++;
    } else {
      break;
    }
  }
  
  if (reconstructed) {
    console.log(`Reconstructed ${varName} from ${partIndex - 1} parts (total: ${reconstructed.length} chars)`);
  }
  
  return reconstructed || undefined;
}

// Test environment variables
const KOMMO_BASE_URL = getEnvVar('KOMMO_BASE_URL');
const KOMMO_ACCESS_TOKEN = getEnvVar('KOMMO_ACCESS_TOKEN');
const PORT = getEnvVar('PORT') || 3000;

console.log('=== Environment Variable Test ===');
console.log(`KOMMO_BASE_URL: ${KOMMO_BASE_URL ? 'SET' : 'MISSING'}`);
console.log(`KOMMO_ACCESS_TOKEN: ${KOMMO_ACCESS_TOKEN ? `SET (${KOMMO_ACCESS_TOKEN.length} chars)` : 'MISSING'}`);
console.log(`PORT: ${PORT}`);

// Show all environment variables that start with KOMMO
console.log('\n=== All KOMMO Environment Variables ===');
Object.keys(process.env)
  .filter(key => key.startsWith('KOMMO'))
  .sort()
  .forEach(key => {
    const value = process.env[key];
    console.log(`${key}: ${value.length} chars - ${value.substring(0, 50)}...`);
  });

// Simple endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'Environment Variable Test',
    environment: {
      baseUrl: KOMMO_BASE_URL ? 'SET' : 'MISSING',
      tokenLength: KOMMO_ACCESS_TOKEN ? KOMMO_ACCESS_TOKEN.length : 0,
      port: PORT,
      allKommoVars: Object.keys(process.env)
        .filter(key => key.startsWith('KOMMO'))
        .reduce((acc, key) => {
          acc[key] = process.env[key].length + ' chars';
          return acc;
        }, {})
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      baseUrl: KOMMO_BASE_URL ? 'SET' : 'MISSING',
      tokenLength: KOMMO_ACCESS_TOKEN ? KOMMO_ACCESS_TOKEN.length : 0,
      tokenValid: KOMMO_ACCESS_TOKEN && KOMMO_ACCESS_TOKEN.length > 1000,
      port: PORT
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`✅ Environment variables loaded successfully`);
}); 