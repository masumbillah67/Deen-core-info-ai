import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, AppSettings } from '../types';
import { 
  ArrowUp,
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  AlertOctagon, 
  CheckCircle2, 
  Menu, 
  BookOpen, 
  ShieldCheck,
  Trash2,
  LogIn,
  Sparkles
} from 'lucide-react';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  user: UserProfile;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onToggleSidebar: () => void;
  onClearCurrentChat: () => void;
  onOpenAuth: () => void;
}

// Minimalist Markdown and formatting parser for crisp ChatGPT-style typography
const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key} className="space-y-1.5 my-2 pl-4 list-disc marker:text-emerald-500/80">
          {currentList.map((item, idx) => (
            <li key={idx} className="leading-relaxed text-zinc-200 text-sm">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  function renderInline(str: string): React.ReactNode {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono text-[11px] border border-zinc-700/60">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed === '---' || trimmed === '***') {
      flushList(`list-${index}`);
      elements.push(<hr key={`hr-${index}`} className="my-3 border-zinc-800" />);
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushList(`list-${index}`);
      elements.push(
        <h4 key={`h3-${index}`} className="text-sm font-semibold text-zinc-100 mt-3 mb-1 tracking-tight">
          {renderInline(trimmed.replace(/^###\s+/, ''))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(`list-${index}`);
      elements.push(
        <h3 key={`h2-${index}`} className="text-base font-semibold text-white mt-3.5 mb-1.5 tracking-tight">
          {renderInline(trimmed.replace(/^##\s+/, ''))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      flushList(`list-${index}`);
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-2 pl-3 border-l-2 border-emerald-500/70 text-zinc-300 italic bg-zinc-800/30 py-1 rounded-r text-xs sm:text-sm"
        >
          {renderInline(trimmed.replace(/^>\s+/, ''))}
        </blockquote>
      );
      return;
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      const cleanItem = trimmed.replace(/^(\*|-|\d+\.)\s+/, '');
      currentList.push(cleanItem);
      return;
    }

    flushList(`list-${index}`);
    if (trimmed === '') {
      elements.push(<div key={`empty-${index}`} className="h-1.5" />);
    } else {
      elements.push(
        <p key={`p-${index}`} className="leading-relaxed text-zinc-200 text-sm my-0.5">
          {renderInline(line)}
        </p>
      );
    }
  });

  flushList('final-list');

  return <div className="space-y-0.5 font-sans">{elements}</div>;
};

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  user,
  settings,
  onUpdateSettings,
  onToggleSidebar,
  onClearCurrentChat,
  onOpenAuth,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isBn = settings.defaultLanguage !== 'en';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = () => {
    if (!inputText.trim() || isProcessing) return;
    const textToSend = inputText.trim();
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSpeak = (msg: ChatMessage) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msg.text.replace(/[*#>_-]/g, ''));
    utterance.lang = settings.defaultLanguage === 'en' ? 'en-US' : 'bn-BD';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(msg.id);
    window.speechSynthesis.speak(utterance);
  };

  const samplePrompts = [
    {
      titleBn: 'AI ও প্রযুক্তি ইসলামে কি জায়েজ?',
      titleEn: 'Is AI & technology permissible in Islam?',
    },
    {
      titleBn: 'সুদ ও অনলাইন জুয়া কেন সম্পূর্ণ হারাম?',
      titleEn: 'Why are interest & betting forbidden?',
    },
    {
      titleBn: 'কুরআনে মহাবিশ্ব সৃষ্টির বৈজ্ঞানিক নিদর্শন',
      titleEn: 'Scientific signs in Quran & cosmology',
    },
    {
      titleBn: 'খাঁটি তওবা কবুল হওয়ার প্রধান শর্তগুলো কী?',
      titleEn: 'What are the core conditions of repentance?',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#212121] text-zinc-100 overflow-hidden relative">
      {/* Top Header Bar - Minimalist ChatGPT style */}
      <header className="h-12 border-b border-zinc-800/80 bg-[#1e1e1e] px-3.5 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Model indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-zinc-800/60 cursor-pointer transition-colors">
            <span className="text-sm font-semibold text-zinc-100 tracking-tight flex items-center gap-1.5">
              DeenCore <span className="text-emerald-400 font-bold">AI</span>
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              3.1
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="bg-zinc-800/70 border border-zinc-700/50 rounded-lg p-0.5 flex items-center text-xs">
            <button
              onClick={() => onUpdateSettings({ ...settings, defaultLanguage: 'bn' })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                settings.defaultLanguage === 'bn'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => onUpdateSettings({ ...settings, defaultLanguage: 'en' })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                settings.defaultLanguage === 'en'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Clear Current Chat */}
          {messages.length > 0 && (
            <button
              onClick={onClearCurrentChat}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
              title={isBn ? 'চ্যাট পরিষ্কার করুন' : 'Clear chat'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* User Sign In pill if guest */}
          {!user.userId ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 px-2.5 py-1 rounded-lg font-medium transition-colors"
            >
              <LogIn className="w-3 h-3 text-emerald-400" />
              <span>{isBn ? 'লগইন' : 'Sign in'}</span>
            </button>
          ) : (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full border border-zinc-700 object-cover"
              title={`${user.name} (${user.email})`}
            />
          )}
        </div>
      </header>

      {/* Messages Canvas - ChatGPT clean centered reading flow */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          /* Minimalist ChatGPT Style Empty State */
          <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 mx-auto flex items-center justify-center text-emerald-400 font-bold text-sm">
              د
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">
                {isBn ? 'আমি আপনাকে কীভাবে সাহায্য করতে পারি?' : 'What can I help with today?'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isBn
                  ? 'প্রতিটি প্রশ্নের সাপেক্ষে পবিত্র কুরআন ও সহীহ হাদিসের নির্ভরযোগ্য সমাধান'
                  : 'Islamic answers grounded in the Holy Quran & authentic Hadith'}
              </p>
            </div>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left max-w-xl mx-auto pt-2">
              {samplePrompts.map((p, idx) => {
                const label = isBn ? p.titleBn : p.titleEn;
                return (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(label)}
                    className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 hover:bg-zinc-800/90 hover:border-zinc-600 transition-colors text-left text-xs text-zinc-300 hover:text-white"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              const isSpeaking = speakingId === m.id;
              const isCopied = copiedId === m.id;

              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}
                >
                  {isUser ? (
                    /* User Bubble - ChatGPT subtle dark pill */
                    <div className="max-w-[82%] bg-[#2f2f2f] text-zinc-100 rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {m.text}
                    </div>
                  ) : (
                    /* Assistant Message - Full width flow like ChatGPT */
                    <div className="flex gap-3.5 max-w-full w-full">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/80 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        د
                      </div>

                      <div className="flex-1 space-y-2.5 min-w-0">
                        {/* Status Verdict Pill */}
                        {m.verdict && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-zinc-800/70 border-zinc-700/60 text-zinc-300">
                            {m.isProhibited ? (
                              <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span>{m.verdict}</span>
                          </div>
                        )}

                        {/* Parsed Clean Markdown Content */}
                        <div className="text-zinc-200">
                          <FormattedMessage text={m.text} />
                        </div>

                        {/* Scripture Reference Quote */}
                        {m.scriptureRef && (
                          <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/60 text-xs text-amber-200/90 font-medium">
                            <span className="font-semibold text-zinc-300 flex items-center gap-1.5 mb-1">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                              {isBn ? 'মূল সনদ ও দলিল:' : 'Scriptural Citation:'}
                            </span>
                            {m.scriptureRef}
                          </div>
                        )}

                        {/* Sources Badges */}
                        {m.sources && m.sources.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              {isBn ? 'সূত্র:' : 'Sources:'}
                            </span>
                            {m.sources.map((src, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700/60"
                              >
                                {src}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action buttons (Copy, Read aloud) */}
                        <div className="pt-1 flex items-center gap-1 text-zinc-500">
                          <button
                            onClick={() => handleCopy(m)}
                            className="p-1 hover:text-zinc-200 rounded hover:bg-zinc-800/60 transition-colors"
                            title={isCopied ? 'Copied' : 'Copy response'}
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSpeak(m)}
                            className="p-1 hover:text-zinc-200 rounded hover:bg-zinc-800/60 transition-colors"
                            title={isSpeaking ? 'Stop audio' : 'Listen'}
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Processing / Generating Indicator - Subtle ChatGPT style */}
            {isProcessing && (
              <div className="flex gap-3.5 items-center justify-start">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/80 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  د
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {isBn
                      ? 'কুরআন ও হাদিসের আলোকে উত্তর তৈরি হচ্ছে...'
                      : 'Preparing verified Islamic response...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Area - Authentic ChatGPT rounded container */}
      <div className="p-3 bg-[#212121] shrink-0">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="bg-[#2f2f2f] border border-zinc-700/60 focus-within:border-zinc-500 rounded-3xl flex items-end p-2 transition-colors shadow-sm">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isBn
                  ? 'যেকোনো প্রশ্ন লিখুন (কুরআন ও হাদিসের আলোকে উত্তর পাবেন)...'
                  : 'Ask anything (grounded in Quran & authentic Hadith)...'
              }
              className="flex-1 bg-transparent border-0 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none resize-none px-3 py-1.5 max-h-36 leading-relaxed"
            />

            {/* Send Button: ChatGPT style circle arrow */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isProcessing}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 mb-0.5 mr-0.5 ${
                inputText.trim() && !isProcessing
                  ? 'bg-white text-zinc-900 hover:bg-zinc-200 cursor-pointer'
                  : 'bg-zinc-700/60 text-zinc-500 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 text-center">
            {isBn
              ? 'দ্বীন কোর এআই সম্পূর্ণ পবিত্র কুরআন ও সহীহ সুন্নাহ দ্বারা পরিচালিত।'
              : 'Deen Core AI responses are strictly grounded in the Holy Quran & authentic Sunnah.'}
          </p>
        </div>
      </div>
    </div>
  );
};
