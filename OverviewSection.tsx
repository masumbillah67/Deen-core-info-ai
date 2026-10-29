import React from 'react';
import { ActiveTab, CityLocation } from '../types';
import { calculatePrayerTimes } from '../utils/prayerTimes';
import { 
  Clock, 
  BookOpen, 
  Scroll, 
  HeartHandshake, 
  Compass, 
  Calculator, 
  Bot, 
  ChevronRight,
  Sparkles,
  Volume2
} from 'lucide-react';

interface OverviewSectionProps {
  location: CityLocation;
  setActiveTab: (tab: ActiveTab) => void;
  hijriDate: string;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  location,
  setActiveTab,
  hijriDate,
}) => {
  const times = calculatePrayerTimes(new Date(), location);

  // Quick next prayer detection
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const prayerKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  let nextPrayer = 'Fajr';
  let nextTime = times.Fajr;

  for (const p of prayerKeys) {
    const [h, m] = times[p].split(':').map(Number);
    if (h * 60 + m > currentMinutes) {
      nextPrayer = p;
      nextTime = times[p];
      break;
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Spiritual Greeting Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 border border-emerald-500/30 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{hijriDate} • {location.city}, {location.country}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Deen Core AI Companion
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your comprehensive Islamic gateway for accurate prayer times, Quran recitation, authentic Hadith, Hisnul Muslim Duas, interactive digital Tasbih, and grounded Islamic AI guidance.
            </p>
          </div>

          {/* Next prayer card snippet */}
          <div className="bg-slate-950/70 border border-emerald-500/40 rounded-2xl p-5 text-center min-w-[210px] shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Next Prayer
            </span>
            <div className="text-3xl font-extrabold text-white mb-1">
              {nextPrayer}
            </div>
            <div className="text-lg font-bold text-emerald-300">
              {nextTime}
            </div>
            <button
              onClick={() => setActiveTab('prayers')}
              className="mt-3 w-full bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-emerald-500/30"
            >
              Full Schedule & Qibla
            </button>
          </div>
        </div>
      </div>

      {/* Daily Spiritual Guidance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Ayah of the Day */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Ayah of the Day</span>
              </span>
              <span className="text-[10px] text-slate-500">Surah Al-Baqarah 2:286</span>
            </div>
            <p className="font-arabic text-right text-lg text-emerald-200 leading-relaxed my-2" dir="rtl">
              لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا
            </p>
            <p className="text-xs text-slate-300 italic mt-1">
              "Allah does not burden a soul beyond that it can bear."
            </p>
          </div>
          <button
            onClick={() => setActiveTab('quran')}
            className="mt-4 flex items-center justify-between text-xs text-emerald-400 font-semibold hover:text-emerald-300 pt-3 border-t border-slate-800"
          >
            <span>Open Holy Quran</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hadith of the Day */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Scroll className="w-4 h-4" />
                <span>Prophetic Wisdom</span>
              </span>
              <span className="text-[10px] text-slate-500">Sahih al-Bukhari</span>
            </div>
            <p className="font-arabic text-right text-base text-amber-200 leading-relaxed my-2" dir="rtl">
              إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ
            </p>
            <p className="text-xs text-slate-300 mt-1">
              "Actions are judged by intentions, and every person will be rewarded according to what he intended."
            </p>
          </div>
          <button
            onClick={() => setActiveTab('hadith')}
            className="mt-4 flex items-center justify-between text-xs text-amber-400 font-semibold hover:text-amber-300 pt-3 border-t border-slate-800"
          >
            <span>Browse Authentic Hadiths</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Remembrance (Hisnul Muslim) */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4" />
                <span>Daily Protection Dua</span>
              </span>
              <span className="text-[10px] text-slate-500">Morning & Evening</span>
            </div>
            <p className="font-arabic text-right text-base text-teal-200 leading-relaxed my-2" dir="rtl">
              بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ
            </p>
            <p className="text-xs text-slate-300 mt-1">
              "In the name of Allah, with whose name nothing on earth or in heaven can cause harm..."
            </p>
          </div>
          <button
            onClick={() => setActiveTab('duas')}
            className="mt-4 flex items-center justify-between text-xs text-teal-400 font-semibold hover:text-teal-300 pt-3 border-t border-slate-800"
          >
            <span>Read Fortress of the Muslim</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Exploration Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('tasbih')}
          className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/30 text-left transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Digital Tasbih</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">33/100 count dhikr counter</p>
        </button>

        <button
          onClick={() => setActiveTab('zakat')}
          className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/30 text-left transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Zakat Calculator</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Gold/Silver Nisab thresholds</p>
        </button>

        <button
          onClick={() => setActiveTab('assistant')}
          className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/30 text-left transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Deen AI Assistant</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Islamic questions & rulings</p>
        </button>

        <button
          onClick={() => setActiveTab('prayers')}
          className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/30 text-left transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Qibla & Prayers</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Makkah direction & times</p>
        </button>
      </div>
    </div>
  );
};
