#!/usr/bin/env node

// Universal function to reconstruct split environment variables
function getEnvVar(varName) {
  console.log(`\n🔍 Looking for environment variable: ${varName}`);
  
  // First try to get the variable directly
  if (process.env[varName]) {
    console.log(`✅ Found direct env var: ${varName} (${process.env[varName].length} chars)`);
    return process.env[varName];
  }
  
  // If not found, try to reconstruct from split parts
  let reconstructed = '';
  let partIndex = 1;
  const foundParts = [];
  
  while (true) {
    const partName = `${varName}_${partIndex}`;
    const part = process.env[partName];
    
    if (part) {
      console.log(`📦 Found part ${partIndex}: ${partName} (${part.length} chars)`);
      foundParts.push({ name: partName, length: part.length });
      reconstructed += part;
      partIndex++;
    } else {
      break;
    }
  }
  
  if (reconstructed) {
    console.log(`🔧 Reconstructed ${varName} from ${foundParts.length} parts (total: ${reconstructed.length} chars)`);
    foundParts.forEach(part => console.log(`   - ${part.name}: ${part.length} chars`));
    return reconstructed;
  }
  
  console.log(`❌ No environment variable found for: ${varName}`);
  return undefined;
}

console.log('🧪 Testing Environment Variable Splitting and Reconstruction\n');

// Simulate the large JWT token being split into parts
const originalToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIwMzQ3ZWI1OWY0NzE5NmJjZGM4OTU4OWY5YTFjOGNkMjU3Y2QyYTM3YTE0MTE0YWFhY2FhZTEzYjBkYTZjN2NhYTExZTFmYTY5OWZhNzVlIn0.eyJhdWQiOiJkZGQ3MjM4MC02NTNjLTQ5MTctYTRiYi01YjMxOTU0ZTNhY2EiLCJqdGkiOiIyMDM0N2ViNTlmNDcxOTZiY2RjODk1ODlmOWExYzhjZDI1N2NkMmEzN2ExNDExNGFhYWNhYWUxM2IwZGE2YzdjYWExMWUxZmE2OTlmYTc1ZSIsImlhdCI6MTc0ODQ4NDY4NSwibmJmIjoxNzQ4NDg0Njg1LCJleHAiOjE4Nzc5MDQwMDAsInN1YiI6IjEzMDIzOTY0IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNjM3NTUxLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNjU5NDAxNGYtMTgzNS00ZmEwLTgxOGUtYzViYzk5Y2QxYWY4IiwiYXBpX2RvbWFpbiI6ImFwaS1nLmtvbW1vLmNvbSJ9.D1Yh6cVMqUdqBoeDR2NLX4EgFHbe5g0g1w_4__3Akg6m7jCFSKoWkbw-HFQuylayBuW4MEIzrkBeNTpM9JIj5ccFedCEpR303mZf4tpe_pUlE6Knk8cpvYGhZY1T0P-SWhO9khWxpiv1mxnhsQs53czvfwTjze0IonM7Mx3yvALbcXvwiW-j75aYUfwvU1xqHRFLjQ9BhHDVpk8vMAsEgrlzSnHUcGjD-Fj5FuwnH8_Dv7aueW-yWOJFGI9o7QTpttxIRZ2lbiqLmw6E1BXyQifZzZPNb1JWVehZX_vKjudZWLumHsej62yGdUe2eeyVLgLgtfRjgqzmVar7Ac62bw";

console.log(`📏 Original token length: ${originalToken.length} characters`);

// Simulate automatic splitting (like our capgen.js does)
const maxSize = 400;
const parts = [];
for (let i = 0; i < originalToken.length; i += maxSize) {
  const chunk = originalToken.slice(i, i + maxSize);
  parts.push(chunk);
}

console.log(`\n🔪 Splitting into ${parts.length} parts of max ${maxSize} chars each:`);
parts.forEach((part, index) => {
  const partName = `KOMMO_ACCESS_TOKEN_${index + 1}`;
  process.env[partName] = part;
  console.log(`   📦 ${partName}: ${part.length} chars`);
});

// Also set a regular environment variable for comparison
process.env.KOMMO_BASE_URL = "https://aabecmed.amocrm.com/api/v4";

// DO NOT set the direct KOMMO_ACCESS_TOKEN - we want to test reconstruction!

console.log('\n' + '='.repeat(60));
console.log('🧪 TESTING RECONSTRUCTION');
console.log('='.repeat(60));

// Test 1: Reconstruct the split token (should use parts)
const reconstructedToken = getEnvVar('KOMMO_ACCESS_TOKEN');

// Test 2: Get a regular environment variable (should use direct)
const baseUrl = getEnvVar('KOMMO_BASE_URL');

// Test 3: Try to get a non-existent variable
const nonExistent = getEnvVar('NON_EXISTENT_VAR');

console.log('\n' + '='.repeat(60));
console.log('📊 RESULTS');
console.log('='.repeat(60));

console.log(`\n✅ Original token length: ${originalToken.length}`);
console.log(`✅ Reconstructed token length: ${reconstructedToken ? reconstructedToken.length : 0}`);
console.log(`✅ Tokens match: ${originalToken === reconstructedToken ? '✅ YES' : '❌ NO'}`);

console.log(`\n✅ Base URL: ${baseUrl ? '✅ SET' : '❌ MISSING'}`);
console.log(`✅ Non-existent var: ${nonExistent ? '✅ SET' : '❌ MISSING (expected)'}`);

console.log('\n' + '='.repeat(60));
console.log('🎯 VERIFICATION');
console.log('='.repeat(60));

if (originalToken === reconstructedToken) {
  console.log('🎉 SUCCESS! Environment variable splitting and reconstruction works perfectly!');
  console.log('✅ The getEnvVar() function correctly:');
  console.log('   - Detects when a variable is split into parts');
  console.log('   - Reconstructs the original value from multiple parts');
  console.log('   - Falls back to direct environment variables');
  console.log('   - Returns undefined for missing variables');
} else {
  console.log('❌ FAILURE! Reconstruction did not work correctly.');
  console.log(`Expected: ${originalToken.substring(0, 50)}...`);
  console.log(`Got: ${reconstructedToken ? reconstructedToken.substring(0, 50) + '...' : 'undefined'}`);
}

console.log('\n🔍 All environment variables starting with KOMMO:');
Object.keys(process.env)
  .filter(key => key.startsWith('KOMMO'))
  .sort()
  .forEach(key => {
    const value = process.env[key];
    console.log(`   ${key}: ${value.length} chars - ${value.substring(0, 30)}...`);
  });

console.log('\n' + '='.repeat(60));
console.log('🔬 DETAILED VERIFICATION');
console.log('='.repeat(60));

// Let's also verify each part individually
console.log('\n🧩 Verifying individual parts:');
let manualReconstruction = '';
for (let i = 1; i <= 3; i++) {
  const partName = `KOMMO_ACCESS_TOKEN_${i}`;
  const part = process.env[partName];
  if (part) {
    manualReconstruction += part;
    console.log(`   Part ${i}: ${part.length} chars - ${part.substring(0, 30)}...`);
  }
}

console.log(`\n🔍 Manual reconstruction length: ${manualReconstruction.length}`);
console.log(`🔍 Manual reconstruction matches: ${originalToken === manualReconstruction ? '✅ YES' : '❌ NO'}`);

// Test the function with both scenarios
console.log('\n🧪 Testing both scenarios:');

// Scenario 1: Only split parts exist (current state)
console.log('\n📋 Scenario 1: Only split parts exist');
const token1 = getEnvVar('KOMMO_ACCESS_TOKEN');
console.log(`   Result: ${token1 ? `${token1.length} chars` : 'undefined'}`);

// Scenario 2: Direct variable exists (should take precedence)
console.log('\n📋 Scenario 2: Direct variable exists (should take precedence)');
process.env.KOMMO_ACCESS_TOKEN = 'direct-token-value';
const token2 = getEnvVar('KOMMO_ACCESS_TOKEN');
console.log(`   Result: ${token2 ? `"${token2}"` : 'undefined'}`);

// Clean up for final test
delete process.env.KOMMO_ACCESS_TOKEN;
console.log('\n📋 Scenario 3: Back to split parts only');
const token3 = getEnvVar('KOMMO_ACCESS_TOKEN');
console.log(`   Result: ${token3 ? `${token3.length} chars` : 'undefined'}`); 