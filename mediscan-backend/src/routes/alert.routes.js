const router = require('express').Router();
const ctrl   = require('../controllers/alert.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

// GET  /api/alerts          — list low-stock + expiring medicines
router.get('/', ctrl.getAlerts);

// POST /api/alerts/send     — manually trigger alert for a medicine
router.post('/send', ctrl.sendAlert);

module.exports = router;
