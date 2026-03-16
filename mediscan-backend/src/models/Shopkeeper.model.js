const mongoose = require('mongoose');

const shopkeeperSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    phone:     { type: String, required: true, trim: true },
    email:     { type: String, lowercase: true, trim: true },
    password:  { type: String, select: false },

    shopName:    { type: String, trim: true },
    shopAddress: { type: String, trim: true },
    licenseNo:   { type: String, trim: true }, // pharmacy license

    isVerified: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
    role:       { type: String, default: 'shopkeeper' },
  },
  { timestamps: true }
);

const bcrypt = require('bcryptjs');

shopkeeperSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

shopkeeperSchema.methods.comparePassword = async function (candidatePassword) {
  return require('bcryptjs').compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Shopkeeper', shopkeeperSchema);
