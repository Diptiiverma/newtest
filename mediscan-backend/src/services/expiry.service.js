const cron = require('node-cron');
const Medicine = require('../models/Medicine.model');
const Patient  = require('../models/Patient.model');
const { sendLowStockAlert, sendExpiryAlert } = require('./sms.service');

/**
 * Runs every day at 8 AM.
 * Checks for:
 *  1. Medicines with stockCount <= lowStockThreshold and alertSent=false
 *  2. Medicines expiring within 7 days and expiryAlertSent=false
 * Emits Socket.io events + sends SMS to patient/guardians.
 */
const startExpiryCron = (io) => {
  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Running daily expiry & stock check...');

    try {
      await checkLowStock(io);
      await checkExpiry(io);
    } catch (err) {
      console.error('[Cron] Error during check:', err.message);
    }
  });

  console.log('[Cron] Expiry & stock cron scheduled (daily 08:00)');
};

// ── Low stock check ────────────────────────────────────────────────────────────
const checkLowStock = async (io) => {
  const medicines = await Medicine.find({
    alertSent: false,
    isActive: true,
    $expr: { $lte: ['$stockCount', '$lowStockThreshold'] },
  }).populate('patient');

  for (const med of medicines) {
    const patient = med.patient;
    if (!patient) continue;

    // Socket.io
    io.to(`patient_${patient._id}`).emit('stock_alert', {
      medicineId: med._id,
      medicineName: med.name,
      stockCount: med.stockCount,
    });

    // SMS → patient + guardians
    const phones = getPatientPhones(patient);
    for (const phone of phones) {
      try {
        await sendLowStockAlert(phone, med.name, med.stockCount);
      } catch (_) { /* don't crash cron on SMS failure */ }
    }

    // Mark alert sent
    await Medicine.findByIdAndUpdate(med._id, { alertSent: true });
    console.log(`[Cron] Low stock alert sent: ${med.name} (${med.stockCount} left)`);
  }
};

// ── Expiry check ───────────────────────────────────────────────────────────────
const checkExpiry = async (io) => {
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const medicines = await Medicine.find({
    expiryAlertSent: false,
    isActive: true,
    expiryDate: { $lte: sevenDaysFromNow, $gte: new Date() },
  }).populate('patient');

  for (const med of medicines) {
    const patient = med.patient;
    if (!patient) continue;

    io.to(`patient_${patient._id}`).emit('expiry_alert', {
      medicineId: med._id,
      medicineName: med.name,
      expiryDate: med.expiryDate,
    });

    const phones = getPatientPhones(patient);
    for (const phone of phones) {
      try {
        await sendExpiryAlert(phone, med.name, med.expiryDate);
      } catch (_) { /* non-fatal */ }
    }

    await Medicine.findByIdAndUpdate(med._id, { expiryAlertSent: true });
    console.log(`[Cron] Expiry alert sent: ${med.name} (expires ${med.expiryDate.toDateString()})`);
  }
};

// ── Utility ────────────────────────────────────────────────────────────────────
const getPatientPhones = (patient) => {
  const phones = [];
  if (patient.phone) phones.push(patient.phone);
  if (patient.guardians) {
    patient.guardians.forEach((g) => { if (g.phone) phones.push(g.phone); });
  }
  return phones;
};

module.exports = { startExpiryCron };
