
import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Message, Role } from './types';
import { geminiService } from './services/geminiService';
import { COPING_SKILLS } from './constants';
import ChatMessage from './components/ChatMessage';
import MoodTracker from './components/MoodTracker';
import SafetyResources from './components/SafetyResources';

const Navigation = () => {
  const location = useLocation();
  const tabs = [
    { path: '/', label: 'Chat', icon: 'fa-comments' },
    { path: '/mood', label: 'Wellbeing', icon: 'fa-heart' },
    { path: '/tools', label: 'Tools', icon: 'fa-toolbox' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-6 py-3 flex justify-around items-center md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-screen md:py-10 md:px-0 md:border-t-0 md:border-r">
      <div className="hidden md:flex flex-col items-center mb-10">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white mb-1 shadow-lg shadow-emerald-200">
          <i className="fas fa-spa"></i>
        </div>
      </div>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link 
            key={tab.path}
            to={tab.path} 
            className={`flex flex-col items-center justify-center space-y-1 group ${
              isActive ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isActive ? 'bg-emerald-50' : 'group-hover:bg-slate-50'
            }`}>
              <i className={`fas ${tab.icon} text-lg`}></i>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest md:hidden">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: Role.BOT,
      content: "Hello! I'm Serenity. I'm here to listen and support you in a safe, non-judgmental way. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(input);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.BOT,
        content: response || "I'm sorry, I'm having trouble connecting right now. Could you try again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: Role.BOT,
        content: "I encountered an error. If you're in distress, please check the safety resources.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <header className="p-4 md:pt-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Serenity</h1>
          <p className="text-xs text-slate-500 flex items-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
            Online Support
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-hide" ref={scrollRef}>
        {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
        {isLoading && (
          <div className="flex justify-start mb-4">
             <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-transparent">
        <div className="relative flex items-end bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-2 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Share what's on your mind..."
            className="flex-1 resize-none border-none focus:ring-0 py-2 px-3 text-sm text-slate-700 bg-transparent min-h-[40px] max-h-32"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              input.trim() && !isLoading ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-slate-100 text-slate-300'
            }`}
          >
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-3 px-4">
          Serenity provides support but is not a medical professional.
        </p>
      </div>
    </div>
  );
};

const WellbeingView = () => (
  <div className="max-w-2xl mx-auto p-4 md:py-10 space-y-6">
    <h1 className="text-2xl font-bold text-slate-800">Your Journey</h1>
    <MoodTracker />
    <SafetyResources />
  </div>
);

const ToolsView = () => (
  <div className="max-w-2xl mx-auto p-4 md:py-10 space-y-6">
    <h1 className="text-2xl font-bold text-slate-800">Coping Strategies</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {COPING_SKILLS.map((skill, idx) => (
        <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <i className={`fas ${skill.icon}`}></i>
          </div>
          <div className="mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 bg-slate-50 rounded-full">{skill.category}</span>
          </div>
          <h3 className="font-bold text-slate-800 mb-1">{skill.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{skill.description}</p>
          <button className="mt-4 text-xs font-bold text-indigo-600 flex items-center hover:underline">
            Try exercise <i className="fas fa-arrow-right ml-1 text-[10px]"></i>
          </button>
        </div>
      ))}
    </div>
    
    <div className="bg-indigo-600 rounded-2xl p-6 text-white overflow-hidden relative">
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-2">Daily Affirmation</h3>
        <p className="italic text-indigo-100">"I am deserving of peace and kindness, from others and myself."</p>
      </div>
      <i className="fas fa-quote-right absolute -bottom-4 -right-2 text-8xl text-indigo-500 opacity-20 rotate-12"></i>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen md:flex-row bg-slate-50 overflow-hidden">
        <Navigation />
        <main className="flex-1 pb-24 md:pb-0 md:pl-20 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ChatView />} />
            <Route path="/mood" element={<WellbeingView />} />
            <Route path="/tools" element={<ToolsView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
