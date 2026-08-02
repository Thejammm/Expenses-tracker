const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/state -> { state: <blob|null> }
router.get('/', requireAuth, async (req, res) => {
  try {
    const r = await pool.query('SELECT data FROM app_state WHERE user_id = $1', [req.user.uid]);
    res.json({ state: r.rows.length ? r.rows[0].data : null });
  } catch (e) {
    console.error('state get', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/state  { state } -> { ok: true }
router.put('/', requireAuth, async (req, res) => {
  try {
    const data = req.body.state;
    if (typeof data !== 'object' || data === null) {
      return res.status(400).json({ error: 'bad state' });
    }
    await pool.query(
      `INSERT INTO app_state (user_id, data, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [req.user.uid, data]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('state put', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
