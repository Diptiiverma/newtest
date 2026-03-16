const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send an SMS via Twilio.
 * @param {string} to   - E.164 phone number, e.g. "+919876543210"
 * @param {string} body - SMS message body
 * @returns {Promise<object>} Twilio message SID object
 */
const sendSMS = async (to, body) => {
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID.startsWith('AC_PLACEHOLDER')) {
    console.log(`[SMS Mock] To: ${to} | Msg: ${body}`);
    return { sid: 'MOCK_SID', status: 'mock' };
  }

  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`[SMS] Sent to ${to} — SID: ${message.sid}`);
    return message;
  } catch (err) {
    console.error(`[SMS] Failed to send to ${to}:`, err.message);
    throw err;
  }
};

// ── Named SMS helpers (match TDR SMS content) ──────────────────────────────────

/**
 * "[Medicine] sirf [N] tablets bachi hain" — Low stock alert
 */
const sendLowStockAlert = async (phone, medicineName, remaining) => {
  const body = `[MediScan] "${medicineName}" sirf ${remaining} tablets bachi hain. Stock bharo jaldi.`;
  return sendSMS(phone, body);
};

/**
 * Expiry warning SMS sent to guardian
 */
const sendExpiryAlert = async (phone, medicineName, expiryDate) => {
  const dateStr = new Date(expiryDate).toLocaleDateString('en-IN');
  const body = `[MediScan] "${medicineName}" ki expiry ${dateStr} ko ho rahi hai. Naya le lo.`;
  return sendSMS(phone, body);
};

/**
 * Dose reminder SMS
 */
const sendDoseReminder = async (phone, medicineName, patient) => {
  const body = `[MediScan] ${patient} ko "${medicineName}" dena hai. Dose ka samay ho gaya.`;
  return sendSMS(phone, body);
};

module.exports = { sendSMS, sendLowStockAlert, sendExpiryAlert, sendDoseReminder };
