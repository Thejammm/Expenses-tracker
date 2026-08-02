# Expenses-tracker — Wages & Expenses Manager

Private, single-user **Wages & Expenses Manager** for AHS Compliance Consulting.
Live at **https://wageex.archerhs.co.uk**.

## What it does
- Monthly wage structure (wage + dividend + expenses = total payment), with
  **auto-filled monthly defaults** and **set-aside pots** (Personal Tax, VAT).
- Expense tracker with mileage, plus one-tap **Quick Log** for regular client sites.
- Analytics: income vs expenses, pots balances, expenses by category.
- PDF report, Excel/CSV export by month / quarter / UK tax year, JSON backup.

## How it runs (dual-mode)
The front-end is one `public/index.html`. Served over http(s) it signs in and
syncs the whole state blob to Postgres, so **phone and desktop share one live
copy**. Opened as a local file (or offline) it falls back to `localStorage`, so
the same file still works with no server.

## Stack
Node/Express, PostgreSQL (`pg`), bcryptjs + JWT (Bearer token). Nixpacks build,
port 3000, health check `GET /healthz`. Deployed on Coolify (Hetzner).

## Env vars
`DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PORT`.
The single user is seeded/updated from `ADMIN_EMAIL` / `ADMIN_PASSWORD` on each
deploy.

## API
- `POST /api/auth` `{email,password}` -> `{token}`
- `GET  /api/state` (Bearer) -> `{state}`
- `PUT  /api/state` (Bearer) `{state}` -> `{ok:true}`
- `GET  /healthz` -> 200
