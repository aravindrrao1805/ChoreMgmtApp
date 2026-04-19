# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A household/office chore scheduling app with a React frontend and a Node/Express backend. Chores are displayed on a calendar and support recurrence (none, weekly, monthly, custom). Family/office members can be assigned to chores and are color-coded on the calendar.

## Tech Stack

- **Frontend:** React 18 + Vite, `react-big-calendar`, `date-fns`
- **Backend:** Node.js + Express, flat-file JSON database (`server/db.json`)
- **Monorepo:** root `package.json` orchestrates both via `concurrently`

## Commands

```bash
# Install all dependencies (root + server + client)
npm run install:all

# Run both dev servers concurrently
npm run dev

# Run only the backend (port 3001, hot-reload via --watch)
npm run dev --prefix server

# Run only the frontend (port 5173, proxies /api → localhost:3001)
npm run dev --prefix client

# Build frontend for production
npm run build --prefix client
```

## Architecture

### Data Flow

All state lives in two custom hooks (`client/src/hooks/useMembers.js`, `client/src/hooks/useChores.js`). Each hook fetches from the API on mount and re-fetches after every mutation (no optimistic updates). `App.jsx` owns modal state and wires hooks to child components.

### API Layer

`client/src/utils/api.js` — single `apiFetch` wrapper around `fetch`. All paths are relative (`/api/...`), proxied to port 3001 by Vite in dev.

### Recurrence Expansion

Chores are stored as rules (not pre-expanded occurrences). `client/src/utils/recurrence.js:expandAll` expands chores into `react-big-calendar` event objects for the visible date range. Supported types: `none`, `weekly` (array of day-of-week ints), `monthly` (day-of-month int), `custom` (interval + unit of `weeks`/`months`).

### Persistence

`server/data.js` — synchronous `fs.readFileSync`/`writeFileSync` on `server/db.json`. The db has two top-level arrays: `members` and `chores`. Deleting a member nulls `assigneeId` on all their chores.

### Member Colors

`client/src/utils/colors.js` assigns a color per member by stable index into a fixed palette. Color lookup is done at event-expansion time in `recurrence.js`.

## Adding New Features or Fixing Bugs

** Important **: When you work on a new feature or a bug, create a git branch first. Then work on that branch for the remainder of the session
