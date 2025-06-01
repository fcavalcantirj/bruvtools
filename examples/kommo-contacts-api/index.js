const express = require('express');
const axios = require('axios');

const app = express();

// Access environment variables
const { KOMMO_BASE_URL, KOMMO_ACCESS_TOKEN, PORT } = process.env;

// Validate environment variables
if (!KOMMO_BASE_URL || !KOMMO_ACCESS_TOKEN) {
  console.error('Error: Missing required environment variables (KOMMO_BASE_URL, KOMMO_ACCESS_TOKEN)');
  console.error('Please set these environment variables and try again.');
  process.exit(1);
}
const headers = {
  Authorization: `Bearer ${KOMMO_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

function removeExtraNine(number) {
  const clean = number.replace(/\D/g, '');
  
  // Only try to remove 9 if number is 11 digits (DDD + 9 + 8 digits)
  // This is the most common case where extra 9 exists
  if (clean.length === 11) {
    // Check if 3rd digit is 9 (position after 2-digit DDD)
    if (clean[2] === '9') {
      return clean.slice(0, 2) + clean.slice(3); // Remove the 9 at position 2
    }
  }
  
  return null; // Can't safely remove a 9
}

function sameNumber(found, searched) {
  const f = found.replace(/\D/g, '');
  const s = searched.replace(/\D/g, '');
  
  // Remove country code if present
  const fCore = f.startsWith('55') ? f.slice(2) : f;
  const sCore = s.startsWith('55') ? s.slice(2) : s;
  
  return fCore === sCore;
}

async function queryKommo(entity, term) {
  const url = `${KOMMO_BASE_URL}/${entity}`;
  const params = { query: term, limit: 50 };
  const r = await axios.get(url, { params, headers });
  return r.data._embedded?.[entity] ?? [];
}

function extractPhones(item) {
  const fields = item.custom_fields_values || [];
  return fields
    .filter(f => f.field_code === 'PHONE' || f.field_type === 'phone')
    .flatMap(f => f.values.map(v => v.value));
}

app.get('/search-whatsapp', async (req, res) => {
  const original = req.query.number;
  if (!original) {
    return res.status(400).json({ error: 'use ?number=<phone>' });
  }

  console.log(`🔍 Searching: ${original}`);

  // 1) Search with original number
  for (const entity of ['contacts', 'leads']) {
    console.log(`Trying ${entity} with original: ${original}`);
    const list = await queryKommo(entity, original);
    console.log(`${entity} returned ${list.length} results`);
    
    for (const item of list) {
      const phones = extractPhones(item);
      console.log(`${entity} ${item.id} phones:`, phones);
      
      const match = phones.find(p => sameNumber(p, original));
      if (match) {
        console.log(`✅ Found in ${entity} ${item.id} with original number`);
        return res.json({
          entity, 
          id: item.id, 
          fullWhatsapp: match,
          searched: original, 
          modified: false
        });
      }
    }
  }

  // 2) Try removing extra 9 if possible
  const modified = removeExtraNine(original);
  if (!modified) {
    console.log(`❌ Cannot safely remove 9 from: ${original}`);
    return res.status(404).json({ 
      error: 'no match found', 
      searched: original 
    });
  }

  console.log(`🔄 Trying without extra 9: ${modified}`);

  for (const entity of ['contacts', 'leads']) {
    console.log(`Trying ${entity} with modified: ${modified}`);
    const list = await queryKommo(entity, modified);
    console.log(`${entity} returned ${list.length} results`);
    
    for (const item of list) {
      const phones = extractPhones(item);
      console.log(`${entity} ${item.id} phones:`, phones);
      
      const match = phones.find(p => sameNumber(p, modified));
      if (match) {
        console.log(`✅ Found in ${entity} ${item.id} after removing 9`);
        return res.json({
          entity, 
          id: item.id, 
          fullWhatsapp: match,
          searched: original, 
          modified: true, 
          used: modified
        });
      }
    }
  }

  console.log(`❌ No match found for: ${original}`);
  return res.status(404).json({ 
    error: 'no match found', 
    searched: original 
  });
});

app.listen(PORT || 80, () => {
  console.log(`🚀 Server running on port ${PORT || 80}`);
});
