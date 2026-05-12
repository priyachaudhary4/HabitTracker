import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Initialize DB for multi-user
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    users: [], // Array of { id, email, password, data: { habits, journalEntries, notes, settings, user } }
  }, null, 2));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Auth Routes
app.post('/api/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const db = readDB();
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password, // In a real app, hash this!
    data: {
      user: { firstName, lastName, email, avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}` },
      habits: [],
      journalEntries: {},
      notes: [],
      settings: {
        dailyReminders: true,
        weeklyReports: true,
        achievementNotifications: true,
        startWeekOn: 'Monday',
        theme: 'Light',
        timezone: 'Auto-detect',
        secureSession: false
      }
    }
  };

  db.users.push(newUser);
  writeDB(db);
  res.json({ success: true, userId: newUser.id, data: newUser.data });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ success: true, userId: user.id, data: user.data });
});

// Data Routes (Protected by userId header for simplicity)
app.get('/api/data', (req, res) => {
  const userId = req.headers['user-id'];
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  res.json(user.data);
});

app.post('/api/data', (req, res) => {
  const userId = req.headers['user-id'];
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return res.status(401).json({ error: 'Unauthorized' });

  const { habits, journalEntries, notes, user, settings } = req.body;
  const userData = db.users[userIndex].data;
  
  if (habits !== undefined) userData.habits = habits;
  if (journalEntries !== undefined) userData.journalEntries = journalEntries;
  if (notes !== undefined) userData.notes = notes;
  if (user !== undefined) userData.user = user;
  if (settings !== undefined) userData.settings = settings;

  writeDB(db);
  res.json({ success: true });
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
