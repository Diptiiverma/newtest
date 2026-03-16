const ScanLog  = require('../models/ScanLog.model');
const Medicine = require('../models/Medicine.model');
const { emitScanComplete } = require('../services/socket.service');
const { lookupMedicine }   = require('../utils/medicineDB');

// GET /api/scan?patientId=xxx
exports.getScanLogs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.patientId) filter.patient = req.query.patientId;

    const logs = await ScanLog.find(filter)
      .populate('patient', 'name phone')
      .populate('medicine', 'name expiryDate stockCount')
      .sort({ scannedAt: -1 })
      .limit(50);

    res.json({ count: logs.length, logs });
  } catch (err) {
    next(err);
  }
};

// POST /api/scan  — create a scan log entry
exports.createScanLog = async (req, res, next) => {
  try {
    const { patientId, scanType, rawData } = req.body;

    if (!patientId || !scanType) {
      return res.status(400).json({ message: 'patientId and scanType are required' });
    }

    // Try to look up medicine from barcode / OCR text
    let result = { recognized: false, source: 'unknown' };
    let medicineId = null;

    if (rawData) {
      const lookup = await lookupMedicine(rawData, scanType);
      if (lookup) {
        result = { recognized: true, ...lookup };

        // Upsert medicine record for this patient
        let med = await Medicine.findOne({ patient: patientId, barcode: lookup.barcode });
        if (!med && lookup.medicineName) {
          med = await Medicine.create({
            name: lookup.medicineName,
            barcode: lookup.barcode,
            manufacturer: lookup.manufacturer,
            expiryDate: lookup.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            patient: patientId,
          });
        }
        if (med) medicineId = med._id;
      }
    }

    const scanLog = await ScanLog.create({
      patient: patientId,
      medicine: medicineId,
      scanType,
      rawData,
      result,
    });

    // Real-time event
    emitScanComplete(patientId, {
      scanLogId: scanLog._id,
      scanType,
      result,
    });

    res.status(201).json(scanLog);
  } catch (err) {
    next(err);
  }
};

// GET /api/scan/:id  — single scan log
exports.getScanLog = async (req, res, next) => {
  try {
    const log = await ScanLog.findById(req.params.id)
      .populate('patient', 'name')
      .populate('medicine');
    if (!log) return res.status(404).json({ message: 'Scan log not found' });
    res.json(log);
  } catch (err) {
    next(err);
  }
};
