const router = require('express').Router();
const ctrl   = require('../controllers/scan.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

// GET  /api/scan           — list scan logs (filter by ?patientId=)
// POST /api/scan           — create scan log
router.route('/').get(ctrl.getScanLogs).post(ctrl.createScanLog);

// GET  /api/scan/:id       — single scan log
router.get('/:id', ctrl.getScanLog);

module.exports = router;
