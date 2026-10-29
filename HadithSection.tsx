import React, { useState } from 'react';
import { HADITHS_DATA } from '../data/hadithData';
import { Search, Copy, Check, Bookmark, BookmarkCheck, BookMarked } from 'lucide-react';

export const HadithSection: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedHadiths, setSavedHadiths] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deen_saved_hadiths');
      return saved ? JSON.parse(saved) : ['bukhari-1'];
    } catch {
      return ['bukhari-1'];
    }
  });

  const topics = ['All', 'Intention & Sincerity', 'Brotherhood & Compassion', 'Kindness & Manners', 'Seeking Knowledge', 'Remembrance of Allah'];

  const filteredHadiths = HADITHS_DATA.filter((h) => {
    const matchesTopic = selectedTopic === 'All' || h.topic === selectedTopic;
    const matchesSearch =
      h.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.arabic.includes(searchQuery);
    return matchesTopic && matchesSearch;
  });

  const toggleSave = (id: string) => {
    const updated = savedHadiths.includes(id)
      ? savedHadiths.filter((i) => i !== id)
      : [...savedHadiths, id];
    setSavedHadiths(updated);
    try {
      localStorage.setItem('deen_saved_hadiths', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCopy = (hadith: (typeof HADITHS_DATA)[0]) => {
    const text = `${hadith.arabic}\n\n"${hadith.english}"\n— Narrated by ${hadith.narrator} (${hadith.book}, Hadith ${hadith.hadithNumber})`;
    navigator.clipboard.writeText(text);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-emerald-400" />
              Authentic Sunnah & Prophetic Traditions
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verified sayings of the Prophet Muhammad (ﷺ) from Sahih al-Bukhari, Sahih Muslim, and An-Nawawi.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search hadith text or narrator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedTopic === t
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Hadith Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHadiths.map((hadith) => {
          const isSaved = savedHadiths.includes(hadith.id);
          const isCopied = copiedId === hadith.id;

          return (
            <div
              key={hadith.id}
              className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-sm"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/50">
                      {hadith.book} #{hadith.hadithNumber}
                    </span>
                    <span className="text-[10px] text-amber-400/90 font-medium bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/40">
                      {hadith.grade}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(hadith)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                      title="Copy hadith text"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => toggleSave(hadith.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors"
                      title={isSaved ? 'Remove from saved' : 'Save hadith'}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Arabic Hadith */}
                <div className="font-arabic text-right text-lg text-emerald-200/95 font-medium leading-relaxed my-3" dir="rtl">
                  {hadith.arabic}
                </div>

                {/* English Hadith */}
                <p className="text-xs text-slate-200 leading-relaxed font-sans mt-2">
                  "{hadith.english}"
                </p>
              </div>

              {/* Narrator Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Narrated by: <span className="text-slate-300 font-medium">{hadith.narrator}</span></span>
                <span className="text-[10px] text-emerald-400/80 bg-emerald-950/30 px-2 py-0.5 rounded">
                  {hadith.topic}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
