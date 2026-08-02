-- Wages & Expenses Manager — schema (single private user)
-- Idempotent: safe to run on every deploy.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per user holds the whole app state blob (expenses, wageData,
-- clients, monthlyDefaults, mileageRate). Last write wins.
CREATE TABLE IF NOT EXISTS app_state (
  user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
