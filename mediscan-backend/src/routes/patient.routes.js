const router  = require('express').Router();
const ctrl    = require('../controllers/patient.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // all patient routes require auth

// GET  /api/patients          — list all
// POST /api/patients          — create
router.route('/').get(ctrl.getPatients).post(ctrl.createPatient);

// GET /api/patients/:id        — single
// PUT /api/patients/:id        — update
// DELETE /api/patients/:id     — soft delete
router
  .route('/:id')
  .get(ctrl.getPatient)
  .put(ctrl.updatePatient)
  .delete(ctrl.deletePatient);

// Guardian management via patient routes
router.post('/:id/guardians', ctrl.addGuardian);
router.delete('/:id/guardians/:phone', ctrl.removeGuardian);

module.exports = router;
