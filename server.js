import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  data: {
    user: {
      firstName: String,
      lastName: String,
      email: String,
      avatar: String
    },
    habits: Array,
    journalEntries: Object,
    notes: Array,
    settings: {
      dailyReminders: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      achievementNotifications: { type: Boolean, default: true },
      startWeekOn: { type: String, default: 'Monday' },
      theme: { type: String, default: 'Light' },
      timezone: { type: String, default: 'Auto-detect' },
      secureSession: { type: Boolean, default: false }
    }
  }
}, { minimize: false }); // preserve empty objects

const User = mongoose.model('User', userSchema);

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({
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
    });

    await newUser.save();
    res.json({ success: true, userId: newUser._id, data: newUser.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ success: true, userId: user._id, data: user.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Data Routes
app.get('/api/data', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    
    res.json(user.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { habits, journalEntries, notes, user: profile, settings } = req.body;
    
    if (habits !== undefined) user.data.habits = habits;
    if (journalEntries !== undefined) user.data.journalEntries = journalEntries;
    if (notes !== undefined) user.data.notes = notes;
    if (profile !== undefined) user.data.user = profile;
    if (settings !== undefined) user.data.settings = settings;

    // Mark as modified for nested objects
    user.markModified('data');
    await user.save();
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
