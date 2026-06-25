# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page React app for collecting Minecraft account applications from students. Students look up their record by student ID, verify ownership of their school email via a Supabase OTP (one-time passcode) email, and the verification is recorded. A public status board and an admin dashboard (with CSV export) read from the same table. The UI is Minecraft-themed and user-facing copy is in Korean.

## Commands

```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint over the repo
```

There is no test suite or test runner configured.

## Environment

Supabase credentials are read from Vite env vars at build/dev time (see `src/lib/supabaseClient.js`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These live in `.env` (gitignored). Missing values produce a misconfigured client rather than a clear error, so verify `.env` exists before debugging "fetch failed" issues.

## Architecture

The app is entirely client-side; Supabase is the only backend. There is no custom server, no API layer, and no auth gating on routes.

**Data model** — a single Supabase table, `students`, with columns: `id`, `student_id`, `name`, `email`, `email_verified` (bool), `verified_at` (timestamp). The roster is pre-seeded (see `list.md` for the source list of names/IDs); the app never inserts students, only updates verification fields on existing rows.

**Routes** (`src/App.jsx`, react-router-dom v7):
- `/` — `StudentLookup`: look up by `student_id`, then trigger `supabase.auth.signInWithOtp({ email })`. Navigates to `/verify` passing `{ student, email }` via router `location.state`.
- `/verify` — `VerifyOTP`: `supabase.auth.verifyOtp(...)`, then writes `email`, `email_verified: true`, `verified_at` back to the student row. **Depends on `location.state`** — redirects to `/` if accessed directly.
- `/status` — `StatusBoard`: public read-only grid of all students with completion stats.
- `/admin` — `AdminPage`: same data as a table, plus client-side CSV export (UTF-8 BOM prepended for Excel). Not access-controlled — anyone with the URL can view it.

**Key coupling**: identity flows through router `location.state`, not URL params or storage. The `students.email_verified` flag is the single source of truth gating the "already applied" path in `StudentLookup` and the counts on both boards.

## Conventions

- All four pages follow the same shape: local `useState`, a Supabase call in an async handler / `useEffect`, manual `loading`/`error` state. No data-fetching library or shared store — replicate this pattern for new pages rather than introducing one.
- Styling is global CSS class names (`mc-*`, `btn-*` in `src/index.css` / `src/App.css`), not CSS modules or a component library.
- ESLint flat config; `no-unused-vars` ignores `^[A-Z_]`-prefixed identifiers (for component/constant imports).

## Deployment

Netlify SPA. `public/_redirects` rewrites all paths to `/index.html` (200) so client-side routes resolve on direct load/refresh.
