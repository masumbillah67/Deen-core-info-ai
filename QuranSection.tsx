import React, { useState, useRef } from 'react';
import { ALL_SURAHS, FEATURED_SURAHS } from '../data/quranData';
import { SurahMeta, Ayah } from '../types';
import { Search, Play, Pause, Bookmark, BookmarkCheck, Volume2, Type } from 'lucide-react';

export const QuranSection: React.FC = () => {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deen_bookmarked_ayahs');
      return saved ? JSON.parse(saved) : ['1:1'];
    } catch {
      return ['1:1'];
    }
  });
  const [arabicFontSize, setArabicFontSize] = useState<number>(28);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSurahDetail = FEATURED_SURAHS[selectedSurahNumber] || FEATURED_SURAHS[1];
  const currentSurahMeta = ALL_SURAHS.find((s) => s.number === selectedSurahNumber) || ALL_SURAHS[0];

  const filteredSurahs = ALL_SURAHS.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      s.number.toString() === searchQuery.trim()
  );

  const toggleBookmark = (key: string) => {
    const updated = bookmarkedAyahs.includes(key)
      ? bookmarkedAyahs.filter((k) => k !== key)
      : [...bookmarkedAyahs, key];
    setBookmarkedAyahs(updated);
    try {
      localStorage.setItem('deen_bookmarked_ayahs', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleSelectSurah = (surah: SurahMeta) => {
    setSelectedSurahNumber(surah.number);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Surah Directory */}
      <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex flex-col h-[650px]">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-base">Surah Directory</h3>
            <span className="text-xs text-slate-400">114 Surahs</span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Surah by name or #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Surahs Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredSurahs.map((surah) => {
            const isSelected = surah.number === selectedSurahNumber;
            const hasFullText = !!FEATURED_SURAHS[surah.number];

            return (
              <button
                key={surah.number}
                onClick={() => handleSelectSurah(surah)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-slate-950/40 hover:bg-slate-800/60 border border-transparent text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {surah.number}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span>{surah.englishName}</span>
                      {hasFullText && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded">
                          Full
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {surah.englishTranslation} • {surah.numberOfAyahs} verses
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-arabic text-sm text-emerald-400 font-bold block">
                    {surah.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {surah.revelationType}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Surah Reader & Audio */}
      <div className="lg:col-span-8 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col h-[650px]">
        {/* Header bar of Reader */}
        <div className="border-b border-slate-800 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                Surah #{currentSurahMeta.number}
              </span>
              <h2 className="text-xl font-bold text-white">
                {currentSurahMeta.englishName} ({currentSurahMeta.englishTranslation})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentSurahMeta.revelationType} • {currentSurahMeta.numberOfAyahs} Verses
            </p>
          </div>

          {/* Action buttons: Audio player & font resizer */}
          <div className="flex items-center gap-3">
            {/* Font size adjustments */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 gap-1 text-slate-400">
              <Type className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <button
                onClick={() => setArabicFontSize((prev) => Math.max(20, prev - 2))}
                className="hover:text-white px-1 text-xs font-bold"
                title="Decrease font"
              >
                A-
              </button>
              <span className="text-[10px] text-slate-500 px-1">{arabicFontSize}px</span>
              <button
                onClick={() => setArabicFontSize((prev) => Math.min(42, prev + 2))}
                className="hover:text-white px-1 text-xs font-bold"
                title="Increase font"
              >
                A+
              </button>
            </div>

            {/* Audio Recitation button */}
            {currentSurahDetail.audioUrl && (
              <>
                <audio
                  ref={audioRef}
                  src={currentSurahDetail.audioUrl}
                  onEnded={() => setIsPlaying(false)}
                />
                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Recitation' : 'Listen Recitation'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Reader Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Bismillah Header (except for Surah 9 At-Tawbah) */}
          {currentSurahMeta.number !== 9 && (
            <div className="text-center py-4 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <p className="font-arabic text-2xl text-emerald-400">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-xs text-slate-400 mt-1">
                In the name of Allah, the Entirely Merciful, the Especially Merciful
              </p>
            </div>
          )}

          {currentSurahDetail.ayahs.map((ayah: Ayah) => {
            const bookmarkKey = `${currentSurahMeta.number}:${ayah.numberInSurah}`;
            const isBookmarked = bookmarkedAyahs.includes(bookmarkKey);

            return (
              <div
                key={ayah.numberInSurah}
                className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/90 hover:border-slate-700/80 transition-all space-y-3"
              >
                {/* Top Ayah bar */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      {ayah.numberInSurah}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Ayah {ayah.numberInSurah} of {currentSurahMeta.numberOfAyahs}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(bookmarkKey)}
                      className="text-slate-400 hover:text-amber-400 transition-colors p-1"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark Ayah'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Script */}
                <div
                  className="font-arabic text-right text-slate-100 font-medium leading-relaxed tracking-wide pt-1"
                  style={{ fontSize: `${arabicFontSize}px` }}
                  dir="rtl"
                >
                  {ayah.textArabic}
                </div>

                {/* Transliteration */}
                {ayah.transliteration && (
                  <p className="text-xs italic text-emerald-300/80 font-sans">
                    {ayah.transliteration}
                  </p>
                )}

                {/* English Translation */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {ayah.translation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
