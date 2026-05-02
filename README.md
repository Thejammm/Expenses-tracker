# Expenses-tracker

A lightweight, single-page **Wages & Expenses Manager** built for AHS Compliance Consulting. Runs entirely in the browser — no backend, no accounts. State is stored in `localStorage` and can be exported to JSON or CSV at any time.

Hosted at **[exp.archersafety.co.uk](https://exp.archersafety.co.uk)** via GitHub Pages.

## What it does

- **Wage Structure** — record monthly wage / dividend / personal-tax / VAT figures, with a simple chart
- **Expense Tracker** — log expenses by date / description / category / amount, with a default mileage rate for travel
- **🚗 Quick Log** — one-tap mileage logging for saved clients & sites
- **📋 Review** — pending-expense approval flow (approve / edit / reject)
- **PDF Report** — month-by-month branded PDF export (jsPDF + AutoTable)
- **📊 Excel Export** — period-filtered CSV export (specific month / UK tax-year quarter / UK tax year / all time) intended for sending to the accountant
- **Save Month** — full self-contained HTML snapshot of the app state for archival
- **Export / Import Data** — JSON backup file for round-tripping state between devices

## Phone → desktop workflow

1. Add expenses on your phone (the app loads at the same URL)
2. **Export Data** → emails the JSON file to yourself
3. On the desktop, **Import Data** → pick the JSON → click **Merge**

The **Merge** import (default) **adds** new entries from the file and keeps everything already on the desktop:

- Expenses match by `id` — duplicates are skipped, never re-added
- Wage months are added if new; existing months are kept untouched (so desktop edits aren't overwritten)
- Clients match by `id`; for matching clients, sites are merged in by site id
- Mileage rate is left unchanged

A separate **Replace all** button is available for the rare case of restoring a full backup. After import, the app reports stats — *"Expenses: N added, M already on file. Wage months: …"*.

## Tech notes

- Pure HTML / CSS / vanilla JS — no build step
- Persistence: `localStorage` under key `wage-structure-blue-vanilla-v1`
- PDF: [jsPDF 2.5.1](https://github.com/parallax/jsPDF) + [jsPDF-AutoTable 3.5.31](https://github.com/simonbengtsson/jsPDF-AutoTable)
- CSV: built in-app (UTF-8 BOM for Excel compatibility)
- Brand: AHS Compliance Consulting — primary `#5BC0CB`, charcoal header `#2c3e50`, logo `ahs.png`

## Files

| File         | Purpose                                                |
|--------------|--------------------------------------------------------|
| `index.html` | The full app (HTML + inline CSS + inline JS)           |
| `ahs.png`    | Brand logo (favicon and header)                        |
| `CNAME`      | GitHub Pages custom domain (`exp.archersafety.co.uk`)  |

## Backups

JSON backups download with the filename pattern `wages-expenses-backup-YYYY-MM-DD.json`. CSV exports download with `wages-expenses-<period>-<YYYY-MM-DD>.csv`. Keep dated backups in cloud storage — the merge import means you can always re-roll any forgotten entries back into the app without losing what you already have.
