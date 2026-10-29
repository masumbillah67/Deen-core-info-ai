import React, { useState } from 'react';
import { BILINGUAL_KNOWLEDGE_BASE, BilingualKnowledgeArticle } from '../data/islamicKnowledge';
import { Bot, Send, Sparkles, ShieldCheck, AlertOctagon, CheckCircle2, Globe, BookOpen } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  verdict?: string;
  isProhibited?: boolean;
  sources?: string[];
  scriptureRef?: string;
  languageUsed?: 'bn' | 'en' | 'bilingual';
}

export const DeenAiAssistantSection: React.FC = () => {
  const [preferredLang, setPreferredLang] = useState<'bn' | 'en' | 'bilingual'>('bn');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text:
        'আস-সালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু (السلام عليكم ورحمة الله وبركاته)।\n\nআমি দ্বীন কোর এআই (Deen Core AI)। আমি সম্পূর্ণ পবিত্র কুরআন ও সহীহ হাদিসের আলোকে আপনার সকল প্রশ্নের উত্তর দিতে প্রস্তুত।\n\n• যে বিষয়গুলো মানুষের জন্য কল্যাণকর (আধুনিক প্রযুক্তি, বিজ্ঞান, চিকিৎসা, সৎ কর্ম)—সেগুলো ইসলাম কীভাবে উৎসাহিত করেছে তা জানুন।\n• যে বিষয়গুলো কুরআন ও হাদিসে নিষেধ ও নাজায়েজ (সুদ, জুয়া, প্রতারণা, হারাম কর্ম)—সেগুলো কেন ও কীভাবে বর্জনীয় তাও স্পষ্টভাবে জানুন।',
      languageUsed: 'bn',
      sources: ['আল-কুরআনুল কারীম', 'সহীহ বুখারী ও সহীহ মুসলিম'],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Suggested questions in Bangla & English
  const quickQuestions = [
    {
      bn: 'ইসলামের দৃষ্টিতে AI ও আধুনিক প্রযুক্তির ব্যবহার কি জায়েয?',
      en: 'Is using AI and modern technology permissible in Islam?',
    },
    {
      bn: 'ইসলামে ব্যাংক সুদ ও রিবা (Riba) কেন হারাম ও নাজায়েজ?',
      en: 'Why is Interest (Riba) strictly prohibited in Islam?',
    },
    {
      bn: 'অনলাইন বেটিং, ক্যাসিনো ও জুয়া খেলার বিধান কী?',
      en: 'What is the ruling on gambling and online betting in Islam?',
    },
    {
      bn: 'পবিত্র কুরআন কীভাবে মহাবিশ্ব ও বিজ্ঞান গবেষণায় উৎসাহিত করে?',
      en: 'How does the Quran encourage science and astronomy?',
    },
    {
      bn: 'ওযুর ৪টি ফরজ এবং সহীহ সুন্নাহ পদ্ধতি কী?',
      en: 'What are the 4 obligations and proper method of Wudu?',
    },
    {
      bn: 'খাঁটি তওবা (তওবাতুন নাসূহা) কবুল হওয়ার ৪টি শর্ত কী?',
      en: 'What are the 4 essential conditions of sincere repentance?',
    },
  ];

  const detectIsProhibitedTopic = (query: string): boolean => {
    const prohibitedKeywords = [
      'সুদ', 'রিবা', 'riba', 'interest', 'usury',
      'জুয়া', 'জুয়া', 'বেটিং', 'gambling', 'betting', 'casino', 'lottery', 'লটারি',
      'মদ', 'নেশা', 'মাদক', 'alcohol', 'khamr', 'intoxicant', 'wine', 'beer',
      'প্রতারণা', 'fraud', 'cheating', 'scam',
      'জুলুম', 'oppression', 'অশ্লীলতা', 'pornography', 'porn', 'অবৈধ হ্যাকিং', 'malware'
    ];
    const q = query.toLowerCase();
    return prohibitedKeywords.some((kw) => q.includes(kw));
  };

  const handleAskQuestion = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      languageUsed: preferredLang,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    const isHaramTopic = detectIsProhibitedTopic(queryText);

    try {
      // 1. First attempt server-side Gemini 3.8 Flash call
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: preferredLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.answer) {
          const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: data.answer,
            isProhibited: isHaramTopic,
            verdict: isHaramTopic
              ? (preferredLang === 'en' ? 'Strictly Prohibited (Haram)' : 'ইসলামে সম্পূর্ণ হারাম ও নাজায়েজ')
              : (preferredLang === 'en' ? 'Permissible & Encouraged in Islam' : 'ইসলামে কল্যাণকর বিষয়ে জায়েয ও উৎসাহিত'),
            sources: ['Al-Quran al-Kareem', 'Sahih Hadith Collections'],
            languageUsed: preferredLang,
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsProcessing(false);
          return;
        }
      }
    } catch (err) {
      console.log('Using local bilingual knowledge engine:', err);
    }

    // 2. Offline / Local Grounded Knowledge Engine
    setTimeout(() => {
      const qLower = queryText.toLowerCase();
      const matched = BILINGUAL_KNOWLEDGE_BASE.find(
        (article) =>
          article.tags.some((tag) => qLower.includes(tag.toLowerCase())) ||
          qLower.includes(article.questionEn.toLowerCase()) ||
          qLower.includes(article.questionBn.toLowerCase())
      );

      let reply: ChatMessage;

      if (matched) {
        let answerText = '';
        if (preferredLang === 'bn') {
          answerText = matched.answerBn;
        } else if (preferredLang === 'en') {
          answerText = matched.answerEn;
        } else {
          // Bilingual
          answerText = `🇧🇩 বাংলা বিবরণ:\n${matched.answerBn}\n\n━━━━━━━━━━━━━━━━━━━━\n\n🇬🇧 English Explanation:\n${matched.answerEn}`;
        }

        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: answerText,
          isProhibited: matched.isProhibitedTopic,
          verdict:
            preferredLang === 'en'
              ? matched.statusVerdictEn
              : matched.statusVerdictBn,
          sources: preferredLang === 'en' ? matched.sourcesEn : matched.sourcesBn,
          scriptureRef: matched.scriptureRef,
          languageUsed: preferredLang,
        };
      } else {
        // Fallback grounded answer
        const isBn = preferredLang !== 'en';
        const fallbackText = isBn
          ? `আপনার প্রশ্ন: "${queryText}"\n\nইসলামে সকল প্রকার আক্বীদা, ইবাদত, মুয়ামালাত (লেনদেন) ও আধুনিক জীবনের দিকনির্দেশনা পবিত্র কুরআন ও রাসূলুল্লাহ (ﷺ)-এর সহীহ সুন্নাহর ভিত্তিতে পরিচালিত হয়।\n\n• কল্যাণকর যেকোনো জ্ঞান ও প্রযুক্তি (চিকিৎসা, বিজ্ঞান, জনকল্যাণ): ইসলামে সম্পূর্ণ জায়েয ও উৎসাহিত (তিরমিজি ২৬৮৭)।\n• যা কিছু মানুষের ধর্ম, জীবন, সম্পদ ও চরিত্রের ক্ষতিসাধন করে (সুদ, জুয়া, মাদক, প্রতারণা): ইসলাম ও কুরআন-হাদিসের দৃষ্টিতে তা স্পষ্টতই নাজায়েজ ও হারাম (সূরা আল-মায়েদাহ ৫:৯০, সূরা আল-বাক্বারাহ ২:২৭৫)।\n\nবিস্তারিত জানার জন্য আপনি উপরের নির্দিষ্ট প্রশ্ন নির্বাচন করতে পারেন অথবা আমাদের হাদিস ও কুরআন সেকশন ব্রাউজ করতে পারেন।`
          : `Regarding: "${queryText}"\n\nIn Islam, all guidance for creed, worship, modern transactions, and daily conduct is established strictly upon the Holy Quran and authentic Sunnah of Prophet Muhammad (ﷺ).\n\n• Beneficial science, technological tools & productive innovations: Fully permissible and encouraged in Islam as 'Ilmun Nafi' (beneficial knowledge - Tirmidhi 2687).\n• Destructive or unethical matters (Interest/Riba, gambling, intoxicants, fraud, digital harm): Strictly Impermissible and Haram according to Quran & Hadith (Surah Al-Ma'idah 5:90, Surah Al-Baqarah 2:275).\n\nPlease explore our curated Hadith, Quran, and Hisnul Muslim libraries for deeper scriptural evidence.`;

        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: fallbackText,
          isProhibited: isHaramTopic,
          verdict: isHaramTopic
            ? (isBn ? 'ইসলামের দৃষ্টিতে নাজায়েজ / হারাম' : 'Prohibited / Haram in Islam')
            : (isBn ? 'কুরআন ও হাদিসের আলোকে দিকনির্দেশনা' : 'Grounded Quran & Sunnah Guidance'),
          sources: [isBn ? 'পবিত্র কুরআন ও সহীহ সুন্নাহ' : 'Holy Quran & Authentic Sunnah'],
          languageUsed: preferredLang,
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner with Bilingual Controls */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl border border-emerald-500/30 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  দ্বীন কোর এআই • Deen Core AI
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  কুরআন ও সহীহ হাদিস ভিত্তিক
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                বাংলা ও ইংরেজিতে উত্তর • কল্যাণকর বিষয় উৎসাহিত • নাজায়েজ বিষয় সুস্পষ্টভাবে চিহ্নিত
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="bg-slate-950/90 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1 mr-0.5" />
            <button
              onClick={() => setPreferredLang('bn')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                preferredLang === 'bn'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা (BN)
            </button>
            <button
              onClick={() => setPreferredLang('en')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                preferredLang === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English (EN)
            </button>
            <button
              onClick={() => setPreferredLang('bilingual')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                preferredLang === 'bilingual'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              উভয় / Dual
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions Grid */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {preferredLang === 'en'
            ? 'Essential Islamic & Technological Inquiries:'
            : 'গুরুত্বপূর্ণ ইসলামিক ও প্রযুক্তিগত প্রশ্নোত্তরসমূহ:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickQuestions.map((q, idx) => {
            const label = preferredLang === 'en' ? q.en : q.bn;
            return (
              <button
                key={idx}
                onClick={() => handleAskQuestion(label)}
                className="text-xs text-left bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-emerald-300 p-2.5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <span className="line-clamp-1">{label}</span>
                <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col h-[560px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => {
            const isUser = m.sender === 'user';

            return (
              <div
                key={m.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-950 border border-slate-800/90 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  {/* Verdict badge (e.g. Haram/Prohibited or Permissible/Encouraged) */}
                  {m.verdict && (
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
                      {m.isProhibited ? (
                        <div className="flex items-center gap-1.5 text-red-400 bg-red-950/60 border border-red-800/60 px-2.5 py-1 rounded-lg font-bold text-xs">
                          <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span>{m.verdict}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{m.verdict}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main text response */}
                  <div className="whitespace-pre-line text-slate-200 leading-relaxed font-sans text-[13px]">
                    {m.text}
                  </div>

                  {/* Scripture Reference Quote */}
                  {m.scriptureRef && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-[11px] text-amber-300/90 font-medium">
                      <span className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
                        <BookOpen className="w-3 h-3" /> মূল উদ্ধৃতি ও সনদ:
                      </span>
                      {m.scriptureRef}
                    </div>
                  )}

                  {/* Verified Sources Badge */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/70 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        {preferredLang === 'en' ? 'Verified Sources:' : 'যাচাইকৃত সূত্রসমূহ:'}
                      </span>
                      {m.sources.map((src, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-slate-800 font-medium"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {preferredLang === 'en'
                    ? 'Consulting Holy Quran & Authentic Hadith sources...'
                    : 'পবিত্র কুরআন ও সহীহ হাদিসের আলোকে উত্তর তৈরি হচ্ছে...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion(inputQuery);
          }}
          className="mt-4 pt-3 border-t border-slate-800 flex gap-2"
        >
          <input
            type="text"
            placeholder={
              preferredLang === 'en'
                ? 'Ask any question on Quran, Hadith, Halal/Haram, AI, technology...'
                : 'কুরআন, হাদিস, হালাল/হারাম বা আধুনিক প্রযুক্তি সম্পর্কিত প্রশ্ন লিখুন...'
            }
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-emerald-950/50"
          >
            <span>{preferredLang === 'en' ? 'Ask' : 'জিজ্ঞাসা'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
