#!/usr/bin/env node

const fullToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIwMzQ3ZWI1OWY0NzE5NmJjZGM4OTU4OWY5YTFjOGNkMjU3Y2QyYTM3YTE0MTE0YWFhY2FhZTEzYjBkYTZjN2NhYTExZTFmYTY5OWZhNzVlIn0.eyJhdWQiOiJkZGQ3MjM4MC02NTNjLTQ5MTctYTRiYi01YjMxOTU0ZTNhY2EiLCJqdGkiOiIyMDM0N2ViNTlmNDcxOTZiY2RjODk1ODlmOWExYzhjZDI1N2NkMmEzN2ExNDExNGFhYWNhYWUxM2IwZGE2YzdjYWExMWUxZmE2OTlmYTc1ZSIsImlhdCI6MTc0ODQ4NDY4NSwibmJmIjoxNzQ4NDg0Njg1LCJleHAiOjE4Nzc5MDQwMDAsInN1YiI6IjEzMDIzOTY0IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNjM3NTUxLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNjU5NDAxNGYtMTgzNS00ZmEwLTgxOGUtYzViYzk5Y2QxYWY4IiwiYXBpX2RvbWFpbiI6ImFwaS1nLmtvbW1vLmNvbSJ9.D1Yh6cVMqUdqBoeDR2NLX4EgFHbe5g0g1w_4__3Akg6m7jCFSKoWkbw-HFQuylayBuW4MEIzrkBeNTpM9JIj5ccFedCEpR303mZf4tpe_pUlE6Knk8cpvYGhZY1T0P-SWhO9khWxpiv1mxnhsQs53czvfwTjze0IonM7Mx3yvALbcXvwiW-j75aYUfwvU1xqHRFLjQ9BhHDVpk8vMAsEgrlzSnHUcGjD-Fj5FuwnH8_Dv7aueW-yWOJFGI9o7QTpttxIRZ2lbiqLmw6E1BXyQifZzZPNb1JWVehZX_vKjudZWLumHsej62yGdUe2eeyVLgLgtfRjgqzmVar7Ac62bw";

console.log('🔪 JWT Token Splitting Tool');
console.log('='.repeat(50));
console.log(`📏 Full token length: ${fullToken.length} characters`);

// Split into 400-character chunks
const maxSize = 400;
const parts = [];

for (let i = 0; i < fullToken.length; i += maxSize) {
  const chunk = fullToken.slice(i, i + maxSize);
  parts.push(chunk);
}

console.log(`\n🧩 Split into ${parts.length} parts:`);

parts.forEach((part, index) => {
  const partNum = index + 1;
  console.log(`\nPart ${partNum}: ${part.length} characters`);
  console.log(`KOMMO_ACCESS_TOKEN_${partNum}="${part}"`);
});

console.log('\n' + '='.repeat(50));
console.log('📋 Export Commands:');
console.log('='.repeat(50));

parts.forEach((part, index) => {
  const partNum = index + 1;
  console.log(`export KOMMO_ACCESS_TOKEN_${partNum}="${part}"`);
});

console.log('\n' + '='.repeat(50));
console.log('🔍 Verification:');
console.log('='.repeat(50));

const reconstructed = parts.join('');
console.log(`Original length: ${fullToken.length}`);
console.log(`Reconstructed length: ${reconstructed.length}`);
console.log(`Match: ${fullToken === reconstructed ? '✅ YES' : '❌ NO'}`);

if (fullToken !== reconstructed) {
  console.log('\n❌ ERROR: Reconstruction failed!');
  console.log(`Original:      ${fullToken.substring(0, 50)}...`);
  console.log(`Reconstructed: ${reconstructed.substring(0, 50)}...`);
} else {
  console.log('\n✅ SUCCESS: Token can be perfectly reconstructed from parts!');
}

console.log('\n' + '='.repeat(50));
console.log('🧪 Test Reconstruction Function:');
console.log('='.repeat(50));

// Simulate environment variables
const env = {};
parts.forEach((part, index) => {
  const partNum = index + 1;
  env[`KOMMO_ACCESS_TOKEN_${partNum}`] = part;
});

// Test reconstruction function
function getEnvVar(varName, envVars = env) {
  // First try to get the variable directly
  if (envVars[varName]) {
    return envVars[varName];
  }
  
  // If not found, try to reconstruct from split parts
  let reconstructed = '';
  let partIndex = 1;
  
  while (true) {
    const partName = `${varName}_${partIndex}`;
    const part = envVars[partName];
    
    if (part) {
      reconstructed += part;
      partIndex++;
    } else {
      break;
    }
  }
  
  return reconstructed || undefined;
}

const testResult = getEnvVar('KOMMO_ACCESS_TOKEN');
console.log(`Function test result: ${testResult ? testResult.length : 0} chars`);
console.log(`Function test match: ${fullToken === testResult ? '✅ YES' : '❌ NO'}`); 