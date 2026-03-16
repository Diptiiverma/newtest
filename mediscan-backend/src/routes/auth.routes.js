const router = require('express').Router();
const authCtrl = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', authCtrl.register);

// POST /api/auth/login
router.post('/login', authCtrl.login);

// GET /api/auth/me
router.get('/me', protect, authCtrl.getMe);

module.exports = router;
