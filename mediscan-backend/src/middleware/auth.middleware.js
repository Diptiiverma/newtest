const jwt = require('jsonwebtoken');

/**
 * Protect routes — verifies Bearer JWT from Authorization header.
 * Attaches decoded payload to req.user.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised: no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Role-based guard — use after protect().
 * Usage: authorise('admin', 'shopkeeper')
 */
const authorise = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: `Role '${req.user?.role}' is not allowed to access this route` });
  }
  next();
};

/**
 * Global error handler — mount LAST in Express stack.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('[Error]', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal Server Error';

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      message: `Duplicate value for field: ${Object.keys(err.keyValue).join(', ')}`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  res.status(statusCode).json({ message });
};

module.exports = { protect, authorise, errorHandler };
