const mongoose = require('mongoose');

const doseScheduleSchema = new mongoose.Schema(
  {
    morning:   { type: Boolean, default: false },
    afternoon: { type: Boolean, default: false },
    night:     { type: Boolean, default: false },
    quantity:  { type: Number, default: 1 }, // tablets / ml per dose
  },
  { _id: false }
);

const medicineSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    genericName:  { type: String, trim: true },
    barcode:      { type: String, trim: true, index: true },
    manufacturer: { type: String, trim: true },
    batchNumber:  { type: String, trim: true },

    purchaseDate: { type: Date },
    expiryDate:   { type: Date, required: true },

    doseSchedule: { type: doseScheduleSchema, default: () => ({}) },
    stockCount:   { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },

    patient:    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    addedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // shopkeeper/guardian ref

    alertSent:      { type: Boolean, default: false }, // low-stock SMS sent
    expiryAlertSent:{ type: Boolean, default: false }, // expiry SMS sent
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual: days until expiry
medicineSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiryDate) return null;
  return Math.ceil((this.expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Medicine', medicineSchema);
