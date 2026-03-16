const Prescription = require('../models/Prescription.model');

// GET /api/prescriptions?patientId=xxx
exports.getPrescriptions = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.patientId) filter.patient = req.query.patientId;

    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'name phone')
      .populate('medicines.medicine', 'name expiryDate stockCount')
      .sort({ prescribedOn: -1 });

    res.json({ count: prescriptions.length, prescriptions });
  } catch (err) {
    next(err);
  }
};

// POST /api/prescriptions
exports.createPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.create(req.body);
    await prescription.populate('patient', 'name phone');
    res.status(201).json(prescription);
  } catch (err) {
    next(err);
  }
};

// GET /api/prescriptions/:id
exports.getPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name phone')
      .populate('medicines.medicine');

    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    next(err);
  }
};

// PUT /api/prescriptions/:id
exports.updatePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/prescriptions/:id  (soft)
exports.deletePrescription = async (req, res, next) => {
  try {
    await Prescription.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Prescription deleted' });
  } catch (err) {
    next(err);
  }
};
