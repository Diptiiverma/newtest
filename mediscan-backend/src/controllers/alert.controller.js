const Medicine = require('../models/Medicine.model');
const Patient  = require('../models/Patient.model');
const { sendLowStockAlert, sendExpiryAlert } = require('../services/sms.service');
const { emitStockAlert, emitExpiryAlert }  = require('../services/socket.service');

// GET /api/alerts  — list medicines that need attention (low stock or expiring)
exports.getAlerts = async (req, res, next) => {
  try {
    const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const lowStock = await Medicine.find({
      isActive: true,
      $expr: { $lte: ['$stockCount', '$lowStockThreshold'] },
    }).populate('patient', 'name phone');

    const expiring = await Medicine.find({
      isActive: true,
      expiryDate: { $lte: sevenDays, $gte: new Date() },
    }).populate('patient', 'name phone');

    res.json({
      lowStockCount: lowStock.length,
      expiringCount: expiring.length,
      lowStock,
      expiring,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/alerts/send  — manually trigger alert for a medicine
exports.sendAlert = async (req, res, next) => {
  try {
    const { medicineId, alertType } = req.body; // alertType: 'lowStock' | 'expiry'

    const medicine = await Medicine.findById(medicineId).populate('patient');
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

    const patient   = medicine.patient;
    const phones    = [patient.phone, ...patient.guardians.map((g) => g.phone)].filter(Boolean);
    const results   = [];

    for (const phone of phones) {
      try {
        let sms;
        if (alertType === 'lowStock') {
          sms = await sendLowStockAlert(phone, medicine.name, medicine.stockCount);
        } else {
          sms = await sendExpiryAlert(phone, medicine.name, medicine.expiryDate);
        }
        results.push({ phone, status: 'sent', sid: sms.sid });
      } catch (e) {
        results.push({ phone, status: 'failed', error: e.message });
      }
    }

    // Socket.io  
    if (alertType === 'lowStock') {
      emitStockAlert(String(patient._id), { medicineId, medicineName: medicine.name, stockCount: medicine.stockCount });
    } else {
      emitExpiryAlert(String(patient._id), { medicineId, medicineName: medicine.name, expiryDate: medicine.expiryDate });
    }

    // Update flag
    const updateField = alertType === 'lowStock' ? { alertSent: true } : { expiryAlertSent: true };
    await Medicine.findByIdAndUpdate(medicineId, updateField);

    res.json({ message: 'Alert sent', results });
  } catch (err) {
    next(err);
  }
};
