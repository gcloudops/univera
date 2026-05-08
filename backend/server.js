require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 5000;

// ── SECURITY ──────────────────────────────────
// Helmet = HTTP headers secure करतो
app.use(helmet());

// CORS = Frontend ला API access देतो
app.use(cors({ origin: '*', credentials: true }));

// JSON body parse करतो
app.use(express.json({ limit: '10mb' }));

// Rate limiting = 15 min मध्ये max 200 requests
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// ── PROMETHEUS METRICS ────────────────────────
// /metrics endpoint → Prometheus इथून data घेतो
const register = new client.Registry();
client.collectDefaultMetrics({ register });
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ── ROUTES ────────────────────────────────────
app.use('/api/auth',     require('./src/routes/auth'));
app.use('/api/courses',  require('./src/routes/courses'));
app.use('/api/payments', require('./src/routes/payments'));
app.use('/api/apply',    require('./src/routes/admissions'));
app.use('/api/hr',       require('./src/routes/hr'));

// ── HEALTH CHECK ──────────────────────────────
// Docker healthcheck हा endpoint वापरतो
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// ── ERROR HANDLER ─────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Univera API running on port ${PORT}`);
});

module.exports = app;