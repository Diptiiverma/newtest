const router = require('express').Router();
const ctrl   = require('../controllers/prescription.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

// GET  /api/prescriptions           — list (filter by ?patientId=)
// POST /api/prescriptions           — create
router.route('/').get(ctrl.getPrescriptions).post(ctrl.createPrescription);

// GET    /api/prescriptions/:id     — single
// PUT    /api/prescriptions/:id     — update
// DELETE /api/prescriptions/:id     — soft delete
router
  .route('/:id')
  .get(ctrl.getPrescription)
  .put(ctrl.updatePrescription)
  .delete(ctrl.deletePrescription);

module.exports = router;
