require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');

// ── Route imports ──────────────────────────────────────────────────────────────
const scanRoutes         = require('./src/routes/scan.routes');
const patientRoutes      = require('./src/routes/patient.routes');
const guardianRoutes     = require('./src/routes/guardian.routes');
const prescriptionRoutes = require('./src/routes/prescription.routes');
const alertRoutes        = require('./src/routes/alert.routes');
const authRoutes         = require('./src/routes/auth.routes');

// ── Services that need io ──────────────────────────────────────────────────────
const { startExpiryCron } = require('./src/services/expiry.service');

const app    = express();
const server = http.createServer(app);

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: '*',          // React Native / Expo client
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('join_patient_room', (patientId) => {
    socket.join(`patient_${patientId}`);
    console.log(`[Socket] ${socket.id} joined room: patient_${patientId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Export io so controllers / services can emit events
module.exports = { io };

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'OK', time: new Date() }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/scan',          scanRoutes);
app.use('/api/patients',      patientRoutes);
app.use('/api/guardians',     guardianRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/alerts',        alertRoutes);

// ── 404 & error handler ───────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(require('./src/middleware/auth.middleware').errorHandler);

// ── Boot ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
    startExpiryCron(io); // start background cron after DB connects
  });
});
