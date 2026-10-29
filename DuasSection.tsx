import React, { useState } from 'react';
import { DUAS_DATA } from '../data/duasData';
import { HeartHandshake, CheckCircle2, RotateCcw, Copy, Check } from 'lucide-react';

export const DuasSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [counters, setCounters] = useState<{ [id: string]: number }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Morning & Evening',
    'Forgiveness',
    'Protection & Anxiety',
    'Prayer & Daily Life',
    'Travel & Food',
    'Gratitude'
  ];

  const filteredDuas = DUAS_DATA.filter(
    (d) => selectedCategory === 'All' || d.category === selectedCategory
  );

  const incrementCounter = (id: string, max: number = 3) => {
    const current = counters[id] || 0;
    if (current < max) {
      setCounters({ ...counters, [id]: current + 1 });
    }
  };

  const resetCounter = (id: string) => {
    setCounters({ ...counters, [id]: 0 });
  };

  const handleCopyDua = (dua: (typeof DUAS_DATA)[0]) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n"${dua.translation}"\n\nReference: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              Hisnul Muslim (Fortress of the Muslim)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Authentic prayers and supplications from the Quran and Sunnah with transliterations and count trackers.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === c
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Duas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuas.map((dua) => {
          const maxRepeats = dua.recommendedRepeats || 1;
          const currentCount = counters[dua.id] || 0;
          const isFinished = currentCount >= maxRepeats;
          const isCopied = copiedId === dua.id;

          return (
            <div
              key={dua.id}
              className={`bg-slate-900/80 rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isFinished ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      {dua.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{dua.title}</h3>
                  </div>

                  <button
                    onClick={() => handleCopyDua(dua)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                    title="Copy Dua"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Arabic Script */}
                <div
                  className="font-arabic text-right text-xl text-emerald-200 font-medium leading-relaxed my-3"
                  dir="rtl"
                >
                  {dua.arabic}
                </div>

                {/* Transliteration */}
                <p className="text-xs italic text-emerald-400/80 font-sans mb-2">
                  {dua.transliteration}
                </p>

                {/* English Translation */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "{dua.translation}"
                </p>

                {/* Benefit note */}
                {dua.benefit && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-300">
                    💡 <span className="font-semibold">Virtue:</span> {dua.benefit}
                  </div>
                )}
              </div>

              {/* Bottom bar with Counter & Reference */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{dua.reference}</span>

                <div className="flex items-center gap-2">
                  {maxRepeats > 1 && (
                    <button
                      onClick={() => resetCounter(dua.id)}
                      className="p-1 text-slate-500 hover:text-slate-300"
                      title="Reset counter"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => incrementCounter(dua.id, maxRepeats)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      isFinished
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900'
                    }`}
                  >
                    {isFinished ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Completed ({maxRepeats}/{maxRepeats})</span>
                      </>
                    ) : (
                      <span>
                        Recite ({currentCount}/{maxRepeats})
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
