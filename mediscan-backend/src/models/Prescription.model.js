const mongoose = require('mongoose');

const prescribedMedicineSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    name:     { type: String }, // fallback plain text if not linked
    dosage:   { type: String }, // "1 tablet twice daily"
    duration: { type: String }, // "7 days"
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },

    doctor:       { type: String, trim: true },
    hospital:     { type: String, trim: true },
    prescribedOn: { type: Date, default: Date.now },

    // OCR / photo upload path or base64
    imageUrl: { type: String },
    ocrText:  { type: String }, // raw OCR from image

    medicines: [prescribedMedicineSchema],

    notes:    { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
