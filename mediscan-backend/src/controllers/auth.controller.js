const jwt      = require('jsonwebtoken');
const Patient  = require('../models/Patient.model');
const Shopkeeper = require('../models/Shopkeeper.model');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'patient', shopName, shopAddress, licenseNo } = req.body;

    if (role === 'shopkeeper') {
      const existing = await Shopkeeper.findOne({ $or: [{ email }, { phone }] });
      if (existing) return res.status(400).json({ message: 'Shopkeeper already registered' });

      const shopkeeper = await Shopkeeper.create({ name, email, phone, password, shopName, shopAddress, licenseNo });
      const token = signToken(shopkeeper._id, shopkeeper.role);
      return res.status(201).json({ token, user: { id: shopkeeper._id, name, role: shopkeeper.role } });
    }

    const existing = await Patient.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ message: 'User already registered' });

    const patient = await Patient.create({ name, email, phone, password, role });
    const token = signToken(patient._id, patient.role);
    res.status(201).json({ token, user: { id: patient._id, name, role: patient.role } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, phone, password, role = 'patient' } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({ message: 'Provide email/phone and password' });
    }

    const query = email ? { email } : { phone };

    let user;
    if (role === 'shopkeeper') {
      user = await Shopkeeper.findOne(query).select('+password');
    } else {
      user = await Patient.findOne(query).select('+password');
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user._id, user.role);
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await Patient.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
