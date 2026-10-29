import React, { useState, useEffect } from 'react';
import { TasbihItem } from '../types';
import { RotateCcw, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';

const DEFAULT_PHRASES: TasbihItem[] = [
  {
    id: 'subhanallah',
    phraseArabic: 'سُبْحَانَ اللَّهِ',
    phraseTransliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah',
    target: 33,
    count: 0,
  },
  {
    id: 'alhamdulillah',
    phraseArabic: 'الْحَمْدُ لِلَّهِ',
    phraseTransliteration: 'Alhamdulillah',
    meaning: 'All praise is for Allah',
    target: 33,
    count: 0,
  },
  {
    id: 'allahuakbar',
    phraseArabic: 'اللَّهُ أَكْبَرُ',
    phraseTransliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest',
    target: 34,
    count: 0,
  },
  {
    id: 'astaghfirullah',
    phraseArabic: 'أَسْتَغْفِرُ اللَّهَ',
    phraseTransliteration: 'Astaghfirullah',
    meaning: 'I seek the forgiveness of Allah',
    target: 100,
    count: 0,
  },
  {
    id: 'tahlil',
    phraseArabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    phraseTransliteration: 'La ilaha illallah',
    meaning: 'None has the right to be worshipped but Allah',
    target: 100,
    count: 0,
  },
  {
    id: 'salawat',
    phraseArabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ',
    phraseTransliteration: 'Allahumma Salli Ala Muhammad',
    meaning: 'O Allah, send peace and blessings upon Muhammad',
    target: 100,
    count: 0,
  },
];

export const TasbihSection: React.FC = () => {
  const [phrases, setPhrases] = useState<TasbihItem[]>(() => {
    try {
      const saved = localStorage.getItem('deen_tasbih_phrases');
      return saved ? JSON.parse(saved) : DEFAULT_PHRASES;
    } catch {
      return DEFAULT_PHRASES;
    }
  });

  const [activePhraseId, setActivePhraseId] = useState<string>('subhanallah');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [totalDhikrToday, setTotalDhikrToday] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('deen_total_dhikr');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const activePhrase = phrases.find((p) => p.id === activePhraseId) || phrases[0];

  useEffect(() => {
    try {
      localStorage.setItem('deen_tasbih_phrases', JSON.stringify(phrases));
      localStorage.setItem('deen_total_dhikr', totalDhikrToday.toString());
    } catch {
      // ignore
    }
  }, [phrases, totalDhikrToday]);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Web audio not supported
    }
  };

  const handleTap = () => {
    playClickSound();

    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }

    setPhrases((prev) =>
      prev.map((p) => {
        if (p.id === activePhraseId) {
          const nextCount = p.count + 1;
          return { ...p, count: nextCount };
        }
        return p;
      })
    );

    setTotalDhikrToday((prev) => prev + 1);
  };

  const resetActive = () => {
    setPhrases((prev) =>
      prev.map((p) => (p.id === activePhraseId ? { ...p, count: 0 } : p))
    );
  };

  const currentCount = activePhrase.count;
  const target = activePhrase.target;
  const progressPercent = Math.min(100, Math.round((currentCount / target) * 100));
  const laps = Math.floor(currentCount / target);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Phrase Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
        {phrases.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePhraseId(p.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activePhraseId === p.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {p.phraseTransliteration} ({p.count})
          </button>
        ))}
      </div>

      {/* Main Tasbih Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Top Controls Bar */}
        <div className="w-full flex items-center justify-between mb-4 z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Target: <strong className="text-white">{target}</strong></span>
            {laps > 0 && (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded ml-2">
                {laps} {laps === 1 ? 'Round' : 'Rounds'} Complete!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={soundEnabled ? 'Mute click sound' : 'Enable click sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={resetActive}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset count to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Arabic Display */}
        <div className="text-center z-10 mb-6">
          <h2 className="font-arabic text-3xl sm:text-4xl text-emerald-300 font-bold mb-1" dir="rtl">
            {activePhrase.phraseArabic}
          </h2>
          <p className="text-base font-semibold text-slate-200">
            {activePhrase.phraseTransliteration}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            "{activePhrase.meaning}"
          </p>
        </div>

        {/* Big Circular Tap Button */}
        <button
          onClick={handleTap}
          className="relative w-56 h-56 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border-4 border-emerald-500/30 flex flex-col items-center justify-center cursor-pointer shadow-2xl active:scale-95 transition-transform group select-none ring-8 ring-emerald-500/10 focus:outline-none"
        >
          {/* Progress Circular SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="104"
              className="text-slate-800/40"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="112"
              cy="112"
              r="104"
              className="text-emerald-400 transition-all duration-200"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 104}
              strokeDashoffset={2 * Math.PI * 104 * (1 - (currentCount % target) / target)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="z-10 text-center">
            <span className="text-5xl font-extrabold text-white tracking-tight block">
              {currentCount}
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 group-hover:text-emerald-300 mt-1 block">
              TAP TO COUNT
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {progressPercent}% of target
            </span>
          </div>
        </button>

        {/* Overall Summary Bar */}
        <div className="mt-8 pt-4 border-t border-slate-800 w-full flex items-center justify-between text-xs text-slate-400 z-10">
          <span className="flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Total Dhikr recorded today:
          </span>
          <span className="font-bold text-white text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {totalDhikrToday} Tasbihat
          </span>
        </div>
      </div>
    </div>
  );
};
