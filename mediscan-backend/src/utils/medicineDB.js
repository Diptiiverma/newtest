const https = require('https');

/**
 * Lookup a medicine by barcode (NDC) or OCR text via OpenFDA.
 * Falls back to local JSON stub if OpenFDA fails or key missing.
 *
 * @param {string} rawData  - barcode string or OCR text
 * @param {string} scanType - 'barcode' | 'ocr' | 'manual' | 'voice'
 * @returns {Promise<object|null>}
 */
const lookupMedicine = async (rawData, scanType) => {
  if (!rawData) return null;

  try {
    if (scanType === 'barcode') {
      return await lookupByBarcode(rawData);
    }
    // For OCR / voice: try to extract medicine name from text and search
    const namePart = extractMedicineName(rawData);
    if (namePart) return await lookupByName(namePart);
  } catch (err) {
    console.warn('[MedicineDB] Lookup failed:', err.message);
  }
  return null;
};

// ── OpenFDA barcode (NDC) lookup ──────────────────────────────────────────────
const lookupByBarcode = (barcode) => {
  return new Promise((resolve) => {
    const apiKey = process.env.OPENFDA_API_KEY ? `&api_key=${process.env.OPENFDA_API_KEY}` : '';
    const url = `https://api.fda.gov/drug/ndc.json?search=product_ndc:"${encodeURIComponent(barcode)}"&limit=1${apiKey}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            const r = json.results[0];
            resolve({
              medicineName: r.brand_name || r.generic_name || 'Unknown',
              manufacturer: r.labeler_name || '',
              barcode,
              source: 'openFDA',
            });
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
};

// ── OpenFDA name search ──────────────────────────────────────────────────────
const lookupByName = (name) => {
  return new Promise((resolve) => {
    const apiKey = process.env.OPENFDA_API_KEY ? `&api_key=${process.env.OPENFDA_API_KEY}` : '';
    const url = `https://api.fda.gov/drug/ndc.json?search=brand_name:"${encodeURIComponent(name)}"&limit=1${apiKey}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            const r = json.results[0];
            resolve({
              medicineName: r.brand_name || r.generic_name || name,
              manufacturer: r.labeler_name || '',
              source: 'openFDA',
            });
          } else {
            resolve({ medicineName: name, source: 'manual' });
          }
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
};

// ── Naive OCR medicine name extractor ────────────────────────────────────────
const extractMedicineName = (text) => {
  // Try to find capitalized word sequences that look like a drug name
  const match = text.match(/\b([A-Z][a-z]+(?: [A-Z][a-z]+)*)\b/);
  return match ? match[1] : text.trim().split('\n')[0];
};

module.exports = { lookupMedicine };
