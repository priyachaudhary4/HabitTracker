
import React, { useState, useEffect } from 'react';
import { View, Habit, JournalEntry, UserProfile, AppSettings, DevNote } from './types';
import { INITIAL_HABITS, ICONS } from './constants';
import Sidebar from './components/Sidebar';
import HabitsView from './components/HabitsView';
import JournalView from './components/JournalView';
import JournalEntryView from './components/JournalEntryView';
import SettingsView from './components/SettingsView';
import AnalyticsView from './components/AnalyticsView';
import NotesView from './components/NotesView';
import AuthView from './components/AuthView';
import { format } from 'date-fns';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<View>(View.HABITS);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Auth State
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('growthpath_userid'));

  // Data State
  const [loading, setLoading] = useState<boolean>(true);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [journalEntries, setJournalEntries] = useState<Record<string, JournalEntry>>({});
  const [notes, setNotes] = useState<DevNote[]>([]);
  const [user, setUser] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    avatar: ''
  });
  const [settings, setSettings] = useState<AppSettings>({
    dailyReminders: true,
    weeklyReports: true,
    achievementNotifications: true,
    startWeekOn: 'Monday',
    theme: 'Light',
    timezone: 'Auto-detect',
    secureSession: false
  });

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch('/api/data', { headers: { 'user-id': userId } })
      .then(res => res.json())
      .then(data => {
        if (data.habits) setHabits(data.habits);
        if (data.journalEntries) setJournalEntries(data.journalEntries);
        if (data.notes) setNotes(data.notes);
        if (data.user) setUser(data.user);
        if (data.settings) setSettings(data.settings);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data', err);
        if (err.message.includes('Unauthorized')) {
           localStorage.removeItem('growthpath_userid');
           setUserId(null);
        }
        setLoading(false);
      });
  }, [userId]);

  // Persistence (Only if not in secureSession mode)
  useEffect(() => {
    if (!loading && !settings.secureSession && userId) {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'user-id': userId },
        body: JSON.stringify({ habits, journalEntries, notes, user, settings })
      }).catch(err => console.error('Error saving data', err));
    }
  }, [habits, journalEntries, notes, user, settings, loading, userId]);

  // Handlers
  const toggleHabit = (habitId: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const completed = h.completions.includes(date);
        return {
          ...h,
          completions: completed 
            ? h.completions.filter(d => d !== date) 
            : [...h.completions, date]
        };
      }
      return h;
    }));
  };

  const addHabit = (name: string, emoji: string) => {
    const newHabit: Habit = { id: Math.random().toString(36).substr(2, 9), name, emoji, category: 'General' as any, completions: [] };
    setHabits(prev => [...prev, newHabit]);
  };

  const saveJournalEntry = (entry: JournalEntry) => setJournalEntries(prev => ({ ...prev, [entry.date]: entry }));
  const saveNote = (note: DevNote) => setNotes(prev => {
    const exists = prev.find(n => n.id === note.id);
    if (exists) return prev.map(n => n.id === note.id ? note : n);
    return [note, ...prev];
  });
  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));
  const navigateToEntry = (date: string) => { setSelectedDate(date); setCurrentView(View.JOURNAL_ENTRY); };

  if (!userId) {
    return <AuthView onLogin={(id, data) => {
      setUserId(id);
      if (data.habits) setHabits(data.habits);
      if (data.journalEntries) setJournalEntries(data.journalEntries);
      if (data.notes) setNotes(data.notes);
      if (data.user) setUser(data.user);
      if (data.settings) setSettings(data.settings);
    }} />;
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#F8F9FD]">Loading...</div>;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${settings.theme === 'Dark' ? 'bg-gray-900 text-white' : 'bg-[#F8F9FD]'}`}>
      <Sidebar activeView={currentView} onViewChange={setCurrentView} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              {currentView === View.HABITS && "Habit Tracker"}
              {currentView === View.JOURNAL && "Journal"}
              {currentView === View.ANALYTICS && "Insights"}
              {currentView === View.NOTES && "Dev Library"}
              {currentView === View.SETTINGS && "Settings"}
            </h1>
            {settings.secureSession && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase">
                {ICONS.Shield} Secure Session Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden shadow-sm">
               <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {(() => {
            switch (currentView) {
              case View.HABITS: return <HabitsView habits={habits} toggleHabit={toggleHabit} addHabit={addHabit} />;
              case View.JOURNAL: return <JournalView entries={journalEntries} onDateSelect={navigateToEntry} />;
              case View.JOURNAL_ENTRY: return <JournalEntryView date={selectedDate} entry={journalEntries[selectedDate]} onSave={saveJournalEntry} onBack={() => setCurrentView(View.JOURNAL)} />;
              case View.ANALYTICS: return <AnalyticsView habits={habits} journalEntries={journalEntries} />;
              case View.NOTES: return <NotesView notes={notes} onSave={saveNote} onDelete={deleteNote} />;
              case View.SETTINGS: return <SettingsView user={user} setUser={setUser} settings={settings} setSettings={setSettings} />;
              default: return null;
            }
          })()}
        </main>
      </div>
    </div>
  );
};

export default App;
