# Chore App — Implementation Plan

## Context
Build a local office chore management app. The team needs a shared calendar to see, schedule, and assign chores. Runs on a single machine, no auth required, no completion tracking. Data persists on disk.

---

## Architecture

```
chore-app/
├── server/          # Node.js + Express backend
│   ├── index.js     # Entry point, API routes
│   ├── data.js      # JSON file read/write helpers
│   └── db.json      # Persistent data store
└── client/          # React frontend (Vite)
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── CalendarWeekly.jsx   # 7-column grid
    │   │   ├── CalendarDaily.jsx    # Single-day list
    │   │   ├── ChoreModal.jsx       # Add/edit/delete chore
    │   │   └── TeamPanel.jsx        # Add/remove members
    │   ├── hooks/
    │   │   └── useChores.js         # API calls + local state
    │   └── utils/
    │       └── recurrence.js        # Expand recurring chores into dates
    └── index.html
```

---

## Data Model (db.json)

```json
{
  "members": [
    { "id": "uuid", "name": "Alice" }
  ],
  "chores": [
    {
      "id": "uuid",
      "title": "Clean kitchen",
      "assigneeId": "uuid | null",
      "startDate": "2026-04-18",
      "recurrence": {
        "type": "none | daily | weekly | monthly",
        "daysOfWeek": [1, 3],   // for weekly: 0=Sun…6=Sat
        "interval": 1            // every N weeks/months
      },
      "endDate": "2026-12-31 | null"
    }
  ]
}
```

---

## API (Express REST)

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/chores | All chores |
| POST | /api/chores | Create chore |
| PUT | /api/chores/:id | Update chore |
| DELETE | /api/chores/:id | Delete chore |
| GET | /api/members | All members |
| POST | /api/members | Add member |
| DELETE | /api/members/:id | Remove member |

---

## Recurrence Logic (`recurrence.js`)

`expandChores(chores, startDate, endDate)` — given a date range (e.g., a week or day), returns a flat list of `{ choreId, title, assigneeName, date }` occurrences by expanding each chore's recurrence rule. Used by both calendar views.

Supported recurrence types:
- `none` — appears once on `startDate`
- `daily` — every N days
- `weekly` — on specific days of week, every N weeks
- `monthly` — same day-of-month, every N months

---

## Frontend Views

### Weekly View (`CalendarWeekly.jsx`)
- 7 columns (Mon–Sun), header row with dates
- Navigate prev/next week with arrow buttons
- Each chore occurrence renders as a colored chip with title + assignee initials
- Click chip → open edit modal; click empty cell → open add modal pre-filled with that date

### Daily View (`CalendarDaily.jsx`)
- Single column list for one day
- Navigate prev/next day
- Same chip style, same modal interactions

### Chore Modal (`ChoreModal.jsx`)
- Fields: Title, Assignee (dropdown of members), Start Date, Recurrence (none/daily/weekly/monthly), Days of Week (multi-select, shown for weekly), Interval, End Date
- Delete button on edit mode

### Team Panel (`TeamPanel.jsx`)
- Sidebar/drawer with list of members
- Add member (name input), delete member button
- Warning if deleting a member who has assigned chores (offer to unassign)

---

## Tech Details

- **Frontend**: React 18 + Vite, no UI library (plain CSS)
- **Backend**: Node.js + Express, `uuid` for IDs, `fs` for JSON persistence
- **CORS**: dev proxy via Vite config (`/api` → `localhost:3001`)
- **Startup**: single `npm run dev` at root using `concurrently` to run both server and client

---

## Verification

1. `npm install && npm run dev` — app opens at `http://localhost:5173`
2. Add 2 team members → appear in Team Panel
3. Add a weekly recurring chore assigned to a member → appears on correct days in weekly view
4. Navigate weeks forward/back → recurrence expands correctly
5. Switch to daily view → same chores visible on matching days
6. Edit chore (change assignee) → update reflected immediately
7. Delete chore → disappears from calendar
8. Delete member with assigned chores → prompt shown, chore becomes unassigned
9. Restart server → data persists (db.json on disk)
