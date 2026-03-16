const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const guardianSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    phone:        { type: String, required: true, trim: true },
    relationship: { type: String, trim: true }, // e.g. Son, Daughter, Spouse
    isEmergency:  { type: Boolean, default: false },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    // Auth fields (patient logs in via phone / email)
    email:    { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone:    { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, select: false }, // hashed

    // Profile
    name:   { type: String, required: true, trim: true },
    age:    { type: Number, min: 0, max: 120 },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    language: { type: String, default: 'en' }, // for voice assistant locale

    // Medical
    conditions:  [{ type: String }], // chronic conditions
    allergies:   [{ type: String }],
    bloodGroup:  { type: String },

    // Guardians list
    guardians: [guardianSchema],

    // Flags
    isActive:   { type: Boolean, default: true },
    role:       { type: String, enum: ['patient', 'guardian', 'shopkeeper', 'admin'], default: 'patient' },
    fcmToken:   { type: String }, // push notification token
  },
  { timestamps: true }
);

// Hash password before save
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
patientSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Patient', patientSchema);
