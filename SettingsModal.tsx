import React from 'react';
import { AppSettings } from '../types';
import { X, Sliders, Globe, Type, Trash2, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (updated: AppSettings) => void;
  onClearAllChats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllChats,
}) => {
  if (!isOpen) return null;

  const isBn = settings.defaultLanguage !== 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 text-emerald-400 flex items-center justify-center border border-zinc-700">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-white">
            {isBn ? 'মডেল সেটিংস ও পছন্দসমূহ' : 'Model Settings & Preferences'}
          </h3>
        </div>

        <div className="space-y-5 text-xs">
          {/* Active AI Model Info */}
          <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-semibold text-zinc-100 block">Gemini 3.1 Flash-Lite (Islamic Grounded)</span>
                <span className="text-[10px] text-zinc-400">Google GenAI Official Model</span>
              </div>
            </div>
            <span className="text-[10px] bg-zinc-800 text-emerald-400 border border-zinc-700 px-2 py-0.5 rounded-full font-medium">
              Active
            </span>
          </div>

          {/* Primary Language */}
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'ডিফল্ট উত্তর দেওয়ার ভাষা' : 'Default Response Language'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, defaultLanguage: 'bn' })}
                className={`py-2 px-3 rounded-xl font-medium transition-colors ${
                  settings.defaultLanguage === 'bn'
                    ? 'bg-zinc-700 text-white border border-zinc-600'
                    : 'bg-zinc-850 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800'
                }`}
              >
                বাংলা (BN)
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, defaultLanguage: 'en' })}
                className={`py-2 px-3 rounded-xl font-medium transition-colors ${
                  settings.defaultLanguage === 'en'
                    ? 'bg-zinc-700 text-white border border-zinc-600'
                    : 'bg-zinc-850 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800'
                }`}
              >
                English (EN)
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, defaultLanguage: 'bilingual' })}
                className={`py-2 px-3 rounded-xl font-medium transition-colors ${
                  settings.defaultLanguage === 'bilingual'
                    ? 'bg-zinc-700 text-white border border-zinc-600'
                    : 'bg-zinc-850 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800'
                }`}
              >
                উভয় (Dual)
              </button>
            </div>
          </div>

          {/* Arabic Font Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBn ? 'আরবি ক্যালিগ্রাফি ফ্রন্টের আকার' : 'Arabic Script Font Size'}</span>
              </span>
              <span className="text-emerald-400 font-bold">{settings.arabicFontSize}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="38"
              step="2"
              value={settings.arabicFontSize}
              onChange={(e) =>
                onUpdateSettings({ ...settings, arabicFontSize: Number(e.target.value) })
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="font-arabic text-center text-emerald-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800" style={{ fontSize: `${settings.arabicFontSize}px` }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>

          {/* Scholarly Depth */}
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block">
              {isBn ? 'উত্তরের গভীরতা ও বিশ্লেষণ' : 'Explanation Depth'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, scholarlyDepth: 'detailed' })}
                className={`py-2 px-3 rounded-xl text-left font-medium transition-all ${
                  settings.scholarlyDepth === 'detailed'
                    ? 'bg-emerald-600/30 border border-emerald-500/50 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white">
                  {isBn ? 'পূর্ণাঙ্গ ও বিস্তারিত' : 'Comprehensive'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isBn ? 'কুরআন ও হাদিসের পূর্ণ সনদসহ' : 'Full proofs & context'}
                </span>
              </button>

              <button
                onClick={() => onUpdateSettings({ ...settings, scholarlyDepth: 'concise' })}
                className={`py-2 px-3 rounded-xl text-left font-medium transition-all ${
                  settings.scholarlyDepth === 'concise'
                    ? 'bg-emerald-600/30 border border-emerald-500/50 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white">
                  {isBn ? 'সংক্ষিপ্ত ও স্পষ্ট' : 'Concise & Direct'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isBn ? 'সরাসরি রায় ও দলিল' : 'Direct rulings & refs'}
                </span>
              </button>
            </div>
          </div>

          {/* Clear History Danger Action */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                if (window.confirm(isBn ? 'আপনি কি সব চ্যাট হিস্ট্রি মুছে ফেলতে চান?' : 'Clear all chat conversations?')) {
                  onClearAllChats();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/50 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'সকল চ্যাট ইতিহাস মুছে ফেলুন' : 'Clear All Chat Conversations'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
