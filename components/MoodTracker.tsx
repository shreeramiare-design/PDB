
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MoodEntry } from '../types';
import { MOOD_DATA_STORAGE_KEY } from '../constants';

const MOODS = [
  { label: 'Terrible', score: 1, icon: 'fa-frown-open', color: 'text-red-500' },
  { label: 'Bad', score: 2, icon: 'fa-frown', color: 'text-orange-400' },
  { label: 'Okay', score: 3, icon: 'fa-meh', color: 'text-yellow-500' },
  { label: 'Good', score: 4, icon: 'fa-smile', color: 'text-lime-500' },
  { label: 'Great', score: 5, icon: 'fa-laugh-beam', color: 'text-emerald-500' },
];

const MoodTracker: React.FC = () => {
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(MOOD_DATA_STORAGE_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const handleLogMood = (score: number, label: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodEntry = { date: today, score, label };
    
    // Simple update: one entry per day
    const updatedHistory = [...history.filter(h => h.date !== today), newEntry]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Keep last 7 days

    setHistory(updatedHistory);
    localStorage.setItem(MOOD_DATA_STORAGE_KEY, JSON.stringify(updatedHistory));
    setSelectedMood(score);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">How are you feeling today?</h3>
      
      <div className="flex justify-between mb-8 px-2">
        {MOODS.map((mood) => (
          <button
            key={mood.score}
            onClick={() => handleLogMood(mood.score, mood.label)}
            className={`flex flex-col items-center transition-all transform hover:scale-110 ${
              selectedMood === mood.score ? 'scale-110' : 'opacity-70 grayscale-[50%]'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
              selectedMood === mood.score ? 'bg-slate-100 ring-2 ring-emerald-400' : 'bg-slate-50'
            }`}>
              <i className={`fas ${mood.icon} text-2xl ${mood.color}`}></i>
            </div>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="h-64 w-full">
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                tickFormatter={(val) => val.split('-').slice(1).join('/')}
              />
              <YAxis domain={[1, 5]} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontSize: '10px', color: '#64748b' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <i className="fas fa-chart-line text-3xl mb-2 opacity-20"></i>
            <p className="text-sm">Log your mood to see trends over time</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
