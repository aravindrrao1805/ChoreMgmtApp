# Chore App — Implementation Plan

## Context
Build the React frontend for an office chore management app. The backend (Express + JSON file persistence) is already fully implemented. The React scaffold exists but `App.jsx` and `index.css` are missing. The goal is a calendar-based UI (month + week views, Outlook-style) where office team members can track recurring chores, assigned by person, color-coded.

---

## Requirements Summary
- Calendar with month + week view toggle
- Add/edit/delete chores via modal
- Recurring chores: weekly (specific days), monthly (day of month), custom (every N weeks/months)
- Assign chores to team members; color-coded chips with name
- Add/remove team members in a sidebar
- No auth, no "mark done" — calendar is purely for tracking

---

## New npm Packages (client only)
```
cd client && npm install react-big-calendar date-fns
```

---

## Recurrence Schema (stored in chore.recurrence)
```js
{ type: 'none' }
{ type: 'weekly',  days: [0, 2, 4] }          // 0=Sun … 6=Sat
{ type: 'monthly', dayOfMonth: 15 }            // cap at 28
{ type: 'custom',  interval: 2, unit: 'weeks' | 'months' }
```

---

## Member Color Strategy
Assign colors deterministically by member index in the array from a fixed 8-color palette. No colors stored in DB. Unassigned chores → gray `#aaaaaa`.

---

## File Structure
```
client/src/
  App.jsx                          ← root layout + all top-level state
  index.css                        ← @import rbc CSS + global reset

  utils/
    api.js                         ← fetch wrappers for all endpoints
    colors.js                      ← PALETTE + getMemberColor(memberId, members)
    recurrence.js                  ← expandChore() + expandAll()

  hooks/
    useMembers.js                  ← {members, addMember, removeMember}
    useChores.js                   ← {chores, addChore, updateChore, deleteChore}

  components/
    Calendar/
      ChoreCalendar.jsx            ← react-big-calendar wrapper
      ChoreEventChip.jsx           ← custom event renderer (color pill + name + title)
    ChoreModal/
      ChoreModal.jsx               ← modal shell (overlay + open/close)
      ChoreForm.jsx                ← controlled form, assembles chore object
      RecurrenceFields.jsx         ← dynamic fields per recurrence type
    Members/
      MemberPanel.jsx              ← sidebar: member list + add form
      MemberItem.jsx               ← one member row + delete button
      AddMemberForm.jsx            ← inline input + Add button
```

---

## Data Flow
- All state lives in `App.jsx` — simple prop drilling, no Context/Redux
- `useMembers` and `useChores` each own their slice: fetch on mount, expose mutation fns that call API then re-fetch
- `ChoreCalendar` receives `chores` + `members`; calls `expandAll()` inside `useMemo`
- Clicking an empty day → opens modal in create mode (date pre-filled)
- Clicking a chore chip → opens modal in edit mode (chore pre-filled)
- Modal calls `onSave`/`onDelete` → hook mutation → re-fetch

---

## Key Logic

### recurrence.js — expandChore(chore, rangeStart, rangeEnd, members)
Returns `CalendarEvent[]` shaped for react-big-calendar:
```js
{ title, start: Date, end: Date, resource: { choreId, chore, color } }
```
- `none` → one event on startDate if in range
- `weekly` → walk day-by-day, emit when `getDay(d)` in `days`
- `monthly` → advance month-by-month, emit on `dayOfMonth`
- `custom weeks` → `addWeeks(date, interval)` from startDate
- `custom months` → `addMonths(date, interval)` from startDate
- Always respect `endDate` if set
- Expand a wide buffer (±3 months) so navigation doesn't re-trigger expansion

### ChoreCalendar.jsx
- Uses `dateFnsLocalizer` from `react-big-calendar`
- Local state: `view` ('month'|'week'), `date` (current nav date)
- `eventPropGetter` → `{ style: { backgroundColor: event.resource.color } }`
- `components={{ event: ChoreEventChip }}`

### ChoreForm.jsx
- Controlled form; initialize from chore prop (edit) or defaults (create)
- Fields: title, assignee (select), startDate, endDate (optional), recurrence type → `<RecurrenceFields>`
- On submit: assemble full chore object with recurrence, call onSubmit

---

## Layout
Two-column flex:
- Left ~240px: `MemberPanel`
- Right flex-grow: header ("Add Chore" button) + `ChoreCalendar` (full height)
- Modal: fixed overlay, conditional render

---

## Pitfalls to Avoid
- **Timezone drift**: parse date strings with `new Date(str + 'T00:00:00')` or `parseISO` to stay in local time
- **RBC CSS**: `@import 'react-big-calendar/lib/css/react-big-calendar.css'` must be first line of `index.css`; use `!important` if overriding `.rbc-event` background
- **Edit pre-population**: initialize `ChoreForm` state from existing `chore.recurrence` or edits will reset recurrence to defaults

---

## Execution Order
1. `npm install` in root, server, and client
2. `utils/api.js` → `utils/colors.js` → `utils/recurrence.js`
3. `hooks/useMembers.js` + `hooks/useChores.js`
4. `index.css`
5. `App.jsx` (stub children first)
6. `ChoreEventChip.jsx` → `ChoreCalendar.jsx`
7. `RecurrenceFields.jsx` → `ChoreForm.jsx` → `ChoreModal.jsx`
8. `AddMemberForm.jsx` → `MemberItem.jsx` → `MemberPanel.jsx`
9. Wire everything in `App.jsx`, run `npm run dev` from root

---

## Verification
1. `npm run dev` from repo root starts both servers (port 3000 client, 3001 server)
2. Add 2–3 team members → verify they appear in sidebar with distinct colors
3. Add a one-time chore on a future date → verify it appears on the calendar on that date
4. Add a weekly chore (Mon + Wed) → verify it repeats across multiple weeks in month view
5. Add a monthly chore (day 1) → navigate months, verify it appears on the 1st
6. Switch between month and week view → chores stay consistent
7. Click a chore chip → edit modal pre-populates correctly → save → updates on calendar
8. Delete a chore → disappears from calendar
9. Remove a team member → their chores become unassigned (gray), member gone from sidebar
