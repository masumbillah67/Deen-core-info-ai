import React from 'react';
import { ChatSession, UserProfile } from '../types';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Sliders, 
  Database,
  Cpu, 
  Scale, 
  Sparkles,
  ChevronLeft,
  LogIn,
  PenSquare
} from 'lucide-react';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onSelectTopic: (topicPrompt: string) => void;
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  language: 'bn' | 'en' | 'bilingual';
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onSelectTopic,
  user,
  onOpenProfile,
  onOpenSettings,
  onOpenAuth,
  language,
  isOpen,
  onToggleSidebar,
}) => {
  const isBn = language !== 'en';

  const handleMobileClick = (action: () => void) => {
    action();
    if (window.innerWidth < 768) {
      onToggleSidebar();
    }
  };

  const topicPresets = [
    {
      icon: <Cpu className="w-3.5 h-3.5 text-zinc-400" />,
      labelBn: 'AI ও আধুনিক প্রযুক্তি',
      labelEn: 'AI & Modern Tech',
      prompt: isBn
        ? 'ইসলামের দৃষ্টিতে কৃত্রিম বুদ্ধিমত্তা (AI) এবং আধুনিক প্রযুক্তির ব্যবহার কি জায়েয?'
        : 'Is using Artificial Intelligence (AI) and modern technology permissible in Islam?',
    },
    {
      icon: <Scale className="w-3.5 h-3.5 text-zinc-400" />,
      labelBn: 'সুদ ও জুয়ার ইসলামী হুকুম',
      labelEn: 'Riba & Gambling Rulings',
      prompt: isBn
        ? 'ইসলামে ব্যাংক সুদ (Riba) এবং অনলাইন জুয়া/বেটিং কেন সম্পূর্ণ নাজায়েজ ও হারাম?'
        : 'Why are Interest (Riba) and online betting strictly prohibited in Islam?',
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-zinc-400" />,
      labelBn: 'কুরআন ও মহাবিশ্বের বিজ্ঞান',
      labelEn: 'Quran & Science',
      prompt: isBn
        ? 'পবিত্র কুরআনে মহাবিশ্ব সৃষ্টি, নক্ষত্র ও বিজ্ঞানের কী কী স্পষ্ট নিদর্শন রয়েছে?'
        : 'How does the Holy Quran speak about science, astronomy, and the universe?',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggleSidebar}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 bg-[#171717] border-r border-zinc-800/80 flex flex-col transition-all duration-200 select-none ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'
        }`}
      >
        {/* Top: Brand & New Chat */}
        <div className="p-3 border-b border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleMobileClick(onNewChat)}
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 font-bold text-xs">
                د
              </div>
              <div>
                <span className="font-semibold text-xs text-zinc-100 tracking-tight flex items-center gap-1">
                  DeenCore <span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  কুরআন ও হাদিস মডেল
                </span>
              </div>
            </div>

            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1 text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button (ChatGPT Style) */}
          <button
            onClick={() => handleMobileClick(onNewChat)}
            className="w-full flex items-center justify-between bg-zinc-800/70 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 font-medium py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? 'নতুন চ্যাট' : 'New chat'}</span>
            </span>
            <PenSquare className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>

        {/* Quick Islamic Topics */}
        <div className="p-2 border-b border-zinc-800/60">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 px-2 block mb-1">
            {isBn ? 'প্রস্তাবিত বিষয়' : 'Topics'}
          </span>
          <div className="space-y-0.5">
            {topicPresets.map((tp, idx) => (
              <button
                key={idx}
                onClick={() => handleMobileClick(() => onSelectTopic(tp.prompt))}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors cursor-pointer text-left"
              >
                {tp.icon}
                <span className="truncate">{isBn ? tp.labelBn : tp.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Previous Chat Sessions */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 px-2 block mb-1">
            {isBn ? 'পূর্ববর্তী কথোপকথন' : 'Chats'}
          </span>

          {sessions.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-xs">
              {isBn ? 'কোনো পূর্ববর্তী চ্যাট নেই' : 'No chats yet'}
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => handleMobileClick(() => onSelectSession(session.id))}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span className="truncate">{session.title}</span>
                  </div>

                  <button
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-opacity"
                    title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom User Area */}
        <div className="p-2.5 border-t border-zinc-800/80 bg-[#171717] space-y-1">
          {user.userId ? (
            /* Logged In User Profile */
            <button
              onClick={onOpenProfile}
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full border border-zinc-700 object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-zinc-200 block truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 truncate">
                    <Database className="w-2.5 h-2.5 text-emerald-400" /> DB Synced
                  </span>
                </div>
              </div>
            </button>
          ) : (
            /* Guest / Login Trigger */
            <button
              onClick={onOpenAuth}
              className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium py-1.5 px-3 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'লগইন / একাউন্ট খুলুন' : 'Sign In / Register'}</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>{isBn ? 'সেটিংস' : 'Settings'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
