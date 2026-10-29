import React from 'react';
import { ActiveTab, CityLocation } from '../types';
import { POPULAR_CITIES } from '../utils/prayerTimes';
import { 
  Compass, 
  BookOpen, 
  Scroll, 
  HeartHandshake, 
  Calculator, 
  Bot, 
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCity: CityLocation;
  setSelectedCity: (city: CityLocation) => void;
  hijriDate: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  hijriDate,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'prayers', label: 'Prayers & Qibla', icon: <Clock className="w-4 h-4" /> },
    { id: 'quran', label: 'Holy Quran', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'hadith', label: 'Authentic Hadith', icon: <Scroll className="w-4 h-4" /> },
    { id: 'duas', label: 'Hisnul Muslim', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'tasbih', label: 'Digital Tasbih', icon: <Compass className="w-4 h-4" /> },
    { id: 'zakat', label: 'Zakat Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'assistant', label: 'Deen AI (বাংলা/EN)', icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-emerald-950/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/30 text-white font-bold text-xl border border-emerald-400/30">
              د
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Deen<span className="text-emerald-400 font-extrabold">Core</span><span className="text-amber-400">AI</span>
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-medium">
                  {hijriDate}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Spiritual Knowledge & Daily Practice Companion
              </p>
            </div>
          </div>

          {/* City / Location Picker */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 shadow-inner">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
              <select
                aria-label="Select City"
                value={selectedCity.city}
                onChange={(e) => {
                  const found = POPULAR_CITIES.find((c) => c.city === e.target.value);
                  if (found) setSelectedCity(found);
                }}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1 font-medium"
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c.city} value={c.city} className="bg-slate-900 text-slate-200">
                    {c.city}, {c.country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-900/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
