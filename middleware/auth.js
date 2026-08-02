// Bearer-token auth. The front-end stores the JWT and sends it as
// Authorization: Bearer <token> on every /api/state call.
const jwt = require('jsonwebtoken');
const SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';

function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'unauthorised' });
  try {
    req.user = jwt.verify(m[1], SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'unauthorised' });
  }
}

module.exports = { requireAuth, SECRET };
