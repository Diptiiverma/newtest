/**
 * batchLookup.js
 * Given a batch number string (e.g. "BT-2024-06-A"),
 * extracts or estimates an expiry date.
 *
 * Real implementation would query a pharmacy/regulatory API.
 * This version uses a pattern-based heuristic + 2-year default.
 */

/**
 * Attempt to parse expiry from a batch number string.
 * Common formats: MMYY, MMYYYY, YYYY-MM, "EXP 06/2026"
 *
 * @param {string} batchOrText  - raw batch number or OCR text snippet
 * @returns {{ expiryDate: Date|null, batchNumber: string }}
 */
const extractExpiryFromBatch = (batchOrText) => {
  if (!batchOrText) return { expiryDate: null, batchNumber: '' };

  const text = batchOrText.toUpperCase();

  // Pattern: EXP 06/2026 or EXP: 06-2026
  let match = text.match(/EXP[:\s]+(\d{2})[\/\-](\d{4})/);
  if (match) {
    const [, month, year] = match;
    return {
      expiryDate: new Date(parseInt(year), parseInt(month) - 1, 1),
      batchNumber: batchOrText,
    };
  }

  // Pattern: 06/2026 or 06-2026
  match = text.match(/(\d{2})[\/\-](\d{4})/);
  if (match) {
    const [, month, year] = match;
    return {
      expiryDate: new Date(parseInt(year), parseInt(month) - 1, 1),
      batchNumber: batchOrText,
    };
  }

  // Pattern: MMYY e.g. "0626"
  match = text.match(/(\d{2})(\d{2})$/);
  if (match) {
    const [, month, yearShort] = match;
    const year = 2000 + parseInt(yearShort);
    return {
      expiryDate: new Date(year, parseInt(month) - 1, 1),
      batchNumber: batchOrText,
    };
  }

  // Default: 2 years from now
  return {
    expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
    batchNumber: batchOrText,
  };
};

module.exports = { extractExpiryFromBatch };
