
import React, { useState } from 'react';
import { View, UserProfile } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, user }) => {
  const [showSupport, setShowSupport] = useState(false);

  const navItems = [
    { id: View.HABITS, label: 'Habits', icon: ICONS.Habits },
    { id: View.JOURNAL, label: 'Journal', icon: ICONS.Journal },
    { id: View.NOTES, label: 'Knowledge Base', icon: ICONS.Knowledge },
    { id: View.ANALYTICS, label: 'Analytics', icon: ICONS.Analytics },
  ];

  const bottomItems = [
    { id: 'support', label: 'Support', icon: ICONS.Support },
    { id: View.SETTINGS, label: 'Settings', icon: ICONS.Settings },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          GP
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">GrowthPath</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeView === item.id 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 mb-4">
        <div className="bg-indigo-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-semibold opacity-75 uppercase tracking-widest mb-1">Growth Level</p>
          <p className="text-lg font-bold mb-2">Pro Developer</p>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="w-3/4 bg-white h-full" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 border-t border-gray-100 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'support') {
                setShowSupport(true);
              } else {
                onViewChange(item.id as View);
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeView === item.id 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        
        <button
          onClick={() => {
            localStorage.removeItem('growthpath_userid');
            window.location.reload();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-2"
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">How can we help?</h3>
            <p className="text-gray-500 mb-6">Here are answers to some common questions:</p>
            
            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <h4 className="font-bold text-gray-800">How do streaks work?</h4>
                <p className="text-sm text-gray-600 mt-1">Streaks represent the number of consecutive days you have completed an action. If you miss a day, your streak resets to 0!</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Is my data secure?</h4>
                <p className="text-sm text-gray-600 mt-1">Yes, your data is saved to a secure backend tied to your account. You can log out safely.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">How do I change to Dark Mode?</h4>
                <p className="text-sm text-gray-600 mt-1">Click the "Settings" button in the sidebar and toggle the Theme dropdown.</p>
              </div>
            </div>

            <button 
              onClick={() => setShowSupport(false)} 
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Close Support
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
