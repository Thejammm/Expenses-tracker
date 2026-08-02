// ══════════════════════════════════════════════════════════════
//  Wages & Expenses Manager — server
//
//  - Serves the front-end from public/
//  - Single private user (email/password), JWT Bearer token
//  - Whole app-state blob stored in Postgres, synced phone <-> desktop
// ══════════════════════════════════════════════════════════════
const express = require('express');
const path    = require('path');

const { migrate, isHealthy } = require('./db');
const { bootstrap }          = require('./bootstrap');
const authRoutes             = require('./routes/auth');
const stateRoutes            = require('./routes/state');

const app  = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0';

app.set('trust proxy', 1);

// Body parsing — generous limit so a large state blob still fits.
app.use(express.json({ limit: '5mb' }));

// ── Health check (public) ─────────────────────────────────────
app.get('/healthz', async (_req, res) => {
  const dbOk = await isHealthy();
  if (!dbOk) return res.status(503).json({ ok: false, db: false });
  res.json({ ok: true, db: true, ts: new Date().toISOString() });
});

// ── API routes ────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/state', stateRoutes);
app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }));

// ── Static front-end ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (/\.html$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=300');
    }
  }
}));

// SPA fallback
app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Startup ───────────────────────────────────────────────────
(async () => {
  try {
    await migrate();
    await bootstrap();
    app.listen(PORT, HOST, () => {
      console.log(`✓ Wages & Expenses Manager listening on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('FATAL: startup failed:', err);
    process.exit(1);
  }
})();
