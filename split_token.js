// Utility to split large environment variables for CapRover
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIwMzQ3ZWI1OWY0NzE5NmJjZGM4OTU4OWY5YTFjOGNkMjU3Y2QyYTM3YTE0MTE0YWFhY2FhZTEzYjBkYTZjN2NhYTExZTFmYTY5OWZhNzVlIn0.eyJhdWQiOiJkZGQ3MjM4MC02NTNjLTQ5MTctYTRiYi01YjMxOTU0ZTNhY2EiLCJqdGkiOiIyMDM0N2ViNTlmNDcxOTZiY2RjODk1ODlmOWExYzhjZDI1N2NkMmEzN2ExNDExNGFhYWNhYWUxM2IwZGE2YzdjYWExMWUxZmE2OTlmYTc1ZSIsImlhdCI6MTc0ODQ4NDY4NSwibmJmIjoxNzQ4NDg0Njg1LCJleHAiOjE4Nzc5MDQwMDAsInN1YiI6IjEzMDIzOTY0IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNjM3NTUxLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNjU5NDAxNGYtMTgzNS00ZmEwLTgxOGUtYzViYzk5Y2QxYWY4IiwiYXBpX2RvbWFpbiI6ImFwaS1nLmtvbW1vLmNvbSJ9.D1Yh6cVMqUdqBoeDR2NLX4EgFHbe5g0g1w_4__3Akg6m7jCFSKoWkbw-HFQuylayBuW4MEIzrkBeNTpM9JIj5ccFedCEpR303mZf4tpe_pUlE6Knk8cpvYGhZY1T0P-SWhO9khWxpiv1mxnhsQs53czvfwTjze0IonM7Mx3yvALbcXvwiW-j75aYUfwvU1xqHRFLjQ9BhHDVpk8vMAsEgrlzSnHUcGjD-Fj5FuwnH8_Dv7aueW-yWOJFGI9o7QTpttxIRZ2lbiqLmw6E1BXyQifZzZPNb1JWVehZX_vKjudZWLumHsej62yGdUe2eeyVLgLgtfRjgqzmVar7Ac62bw";

const chunkSize = 400; // Safe size for CapRover environment variables
const chunks = [];

for (let i = 0; i < token.length; i += chunkSize) {
  chunks.push(token.slice(i, i + chunkSize));
}

console.log(`Token length: ${token.length} characters`);
console.log(`Split into ${chunks.length} parts of max ${chunkSize} characters each:`);
console.log('');

chunks.forEach((chunk, index) => {
  console.log(`KOMMO_ACCESS_TOKEN_PART${index + 1}="${chunk}"`);
});

console.log('');
console.log('Commands to set in bruvtools:');
chunks.forEach((chunk, index) => {
  console.log(`bruvtools env kommo-contacts-api KOMMO_ACCESS_TOKEN_PART${index + 1} "${chunk}"`);
}); 