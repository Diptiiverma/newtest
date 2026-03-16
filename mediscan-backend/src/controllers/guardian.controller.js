const Patient = require('../models/Patient.model');
const { sendSMS } = require('../services/sms.service');

// GET /api/guardians/:patientId  — list guardians for a patient
exports.getGuardians = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.patientId).select('guardians name');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ patient: patient.name, guardians: patient.guardians });
  } catch (err) {
    next(err);
  }
};

// POST /api/guardians/:patientId  — add guardian
exports.addGuardian = async (req, res, next) => {
  try {
    const { name, phone, relationship, isEmergency } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Guardian name and phone are required' });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      { $push: { guardians: { name, phone, relationship, isEmergency } } },
      { new: true, runValidators: true }
    ).select('guardians name');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(201).json({ patient: patient.name, guardians: patient.guardians });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/guardians/:patientId/:phone  — remove guardian by phone
exports.removeGuardian = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      { $pull: { guardians: { phone: req.params.phone } } },
      { new: true }
    ).select('guardians');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ guardians: patient.guardians });
  } catch (err) {
    next(err);
  }
};

// POST /api/guardians/:patientId/notify  — manually send SMS to all guardians
exports.notifyGuardians = async (req, res, next) => {
  try {
    const { message } = req.body;
    const patient = await Patient.findById(req.params.patientId).select('guardians name');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    if (!patient.guardians.length) return res.status(400).json({ message: 'No guardians registered' });

    const results = [];
    for (const guardian of patient.guardians) {
      try {
        const sms = await sendSMS(guardian.phone, `[MediScan] ${message || `Update about ${patient.name}`}`);
        results.push({ phone: guardian.phone, status: 'sent', sid: sms.sid });
      } catch (e) {
        results.push({ phone: guardian.phone, status: 'failed', error: e.message });
      }
    }

    res.json({ results });
  } catch (err) {
    next(err);
  }
};
