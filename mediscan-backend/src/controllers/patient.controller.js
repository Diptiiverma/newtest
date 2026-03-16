const Patient = require('../models/Patient.model');

// GET /api/patients
exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find({ isActive: true }).select('-password');
    res.json({ count: patients.length, patients });
  } catch (err) {
    next(err);
  }
};

// POST /api/patients
exports.createPatient = async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
};

// GET /api/patients/:id
exports.getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    next(err);
  }
};

// PUT /api/patients/:id
exports.updatePatient = async (req, res, next) => {
  try {
    // Prevent password update via this route
    delete req.body.password;

    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/patients/:id  (soft delete)
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deactivated' });
  } catch (err) {
    next(err);
  }
};

// POST /api/patients/:id/guardians  — add guardian to patient
exports.addGuardian = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $push: { guardians: req.body } },
      { new: true, runValidators: true }
    );
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(201).json(patient.guardians);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/patients/:id/guardians/:phone  — remove guardian by phone
exports.removeGuardian = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $pull: { guardians: { phone: req.params.phone } } },
      { new: true }
    );
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient.guardians);
  } catch (err) {
    next(err);
  }
};
