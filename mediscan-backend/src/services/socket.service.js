const { io } = require('../../index');

/**
 * Centralised Socket.io emit helpers.
 * Import this service in any controller that needs real-time events.
 */

/**
 * Emit to ALL connected clients.
 * @param {string} event - Socket event name
 * @param {object} payload - Data to send
 */
const emitGlobal = (event, payload) => {
  io.emit(event, payload);
};

/**
 * Emit to a specific patient room.
 * All sockets that called socket.join(`patient_${patientId}`) will receive this.
 * @param {string} patientId - MongoDB ObjectId string
 * @param {string} event
 * @param {object} payload
 */
const emitToPatient = (patientId, event, payload) => {
  io.to(`patient_${patientId}`).emit(event, payload);
};

// ── Named event helpers ────────────────────────────────────────────────────────

const emitScanComplete = (patientId, scanLog) =>
  emitToPatient(patientId, 'scan_complete', scanLog);

const emitStockAlert = (patientId, data) =>
  emitToPatient(patientId, 'stock_alert', data);

const emitExpiryAlert = (patientId, data) =>
  emitToPatient(patientId, 'expiry_alert', data);

const emitDoseReminder = (patientId, data) =>
  emitToPatient(patientId, 'dose_reminder', data);

module.exports = {
  emitGlobal,
  emitToPatient,
  emitScanComplete,
  emitStockAlert,
  emitExpiryAlert,
  emitDoseReminder,
};
