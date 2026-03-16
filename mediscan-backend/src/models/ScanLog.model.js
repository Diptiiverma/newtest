const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema(
  {
    patient:  { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }, // null if unrecognised

    scanType: {
      type: String,
      enum: ['barcode', 'ocr', 'manual', 'voice'],
      required: true,
    },

    // Raw input captured from camera / voice
    rawData: { type: String }, // barcode string or OCR text blob

    // Parsed / resolved result
    result: {
      recognized:   { type: Boolean, default: false },
      medicineName: { type: String },
      expiryDate:   { type: Date },
      batchNumber:  { type: String },
      manufacturer: { type: String },
      source:       { type: String, enum: ['openFDA', 'localDB', 'manual', 'unknown'], default: 'unknown' },
    },

    // Was this scan acted upon?
    actionTaken: {
      type: String,
      enum: ['added_to_stock', 'updated_stock', 'flagged_expiry', 'prescription_linked', 'none'],
      default: 'none',
    },

    scannedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScanLog', scanLogSchema);
