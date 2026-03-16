const router = require('express').Router();
const ctrl   = require('../controllers/guardian.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

// GET  /api/guardians/:patientId          — list guardians
// POST /api/guardians/:patientId          — add guardian
router
  .route('/:patientId')
  .get(ctrl.getGuardians)
  .post(ctrl.addGuardian);

// DELETE /api/guardians/:patientId/:phone — remove guardian
router.delete('/:patientId/:phone', ctrl.removeGuardian);

// POST /api/guardians/:patientId/notify  — manual SMS to all guardians
router.post('/:patientId/notify', ctrl.notifyGuardians);

module.exports = router;
