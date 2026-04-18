const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { read, write } = require('./data');

const app = express();
app.use(cors());
app.use(express.json());

// Members
app.get('/api/members', (req, res) => {
  const db = read();
  res.json(db.members);
});

app.post('/api/members', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name required' });
  const db = read();
  const member = { id: uuidv4(), name: name.trim() };
  db.members.push(member);
  write(db);
  res.status(201).json(member);
});

app.delete('/api/members/:id', (req, res) => {
  const db = read();
  db.members = db.members.filter(m => m.id !== req.params.id);
  // Unassign chores belonging to deleted member
  db.chores = db.chores.map(c =>
    c.assigneeId === req.params.id ? { ...c, assigneeId: null } : c
  );
  write(db);
  res.json({ ok: true });
});

// Chores
app.get('/api/chores', (req, res) => {
  const db = read();
  res.json(db.chores);
});

app.post('/api/chores', (req, res) => {
  const { title, assigneeId, startDate, recurrence, endDate } = req.body;
  if (!title || !startDate) return res.status(400).json({ error: 'title and startDate required' });
  const db = read();
  const chore = {
    id: uuidv4(),
    title,
    assigneeId: assigneeId || null,
    startDate,
    recurrence: recurrence || { type: 'none' },
    endDate: endDate || null,
  };
  db.chores.push(chore);
  write(db);
  res.status(201).json(chore);
});

app.put('/api/chores/:id', (req, res) => {
  const db = read();
  const idx = db.chores.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.chores[idx] = { ...db.chores[idx], ...req.body, id: req.params.id };
  write(db);
  res.json(db.chores[idx]);
});

app.delete('/api/chores/:id', (req, res) => {
  const db = read();
  db.chores = db.chores.filter(c => c.id !== req.params.id);
  write(db);
  res.json({ ok: true });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
