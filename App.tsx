import React, { useState, useEffect } from 'react';
import { ChatSession, ChatMessage, UserProfile, AppSettings } from './types';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { 
  auth, 
  onAuthStateChanged, 
  syncUserProfile, 
  saveChatSessionToDb, 
  loadUserChatsFromDb, 
  deleteChatFromDb,
  type User
} from './lib/firebase';
import { BILINGUAL_KNOWLEDGE_BASE } from './data/islamicKnowledge';

const DEFAULT_SETTINGS: AppSettings = {
  defaultLanguage: 'bn',
  arabicFontSize: 24,
  scholarlyDepth: 'detailed',
  soundEnabled: true,
  theme: 'dark',
};

const GUEST_USER: UserProfile = {
  name: 'গেস্ট ব্যবহারকারী',
  email: 'guest@deen.ai',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest&backgroundColor=059669',
  isConnectedWithGoogle: false,
  joinedAt: new Date().toLocaleDateString(),
  totalQuestionsAsked: 0,
};

export default function App() {
  const [user, setUser] = useState<UserProfile>(GUEST_USER);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('deen_app_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'session-default',
      title: 'দ্বীন কোর এআই ভূমিকা',
      createdAt: new Date().toLocaleDateString(),
      messages: [
        {
          id: 'intro-welcome',
          sender: 'assistant',
          text:
            'আস-সালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু (السلام عليكم ورحمة الله وبركاته)।\n\nআমি দ্বীন কোর এআই (Deen Core AI)—গুগল জেমিনি (Gemini 3.1) এআই মডেল ও ক্লাউড ডাটাবেজ দ্বারা পরিচালিত ইসলামিক সহযোগী।\n\n★ প্রতিটি প্রশ্নের সাপেক্ষে ইসলামিক দিকনির্দেশনা:\nআপনি যে প্রশ্নই করুন না কেন—দৈনন্দিন জীবন, বিজ্ঞান, প্রযুক্তি, আবেগ-অনুভূতি, ব্যবসা, খাবার বা মাসআলা—পবিত্র কুরআন ও সহীহ হাদিসের সুনির্দিষ্ট রেফারেন্স ও দলিল সহ তার ইসলামিক উত্তর পাবেন ইনশাআল্লাহ।\n\n• আধুনিক বিজ্ঞান ও কল্যাণকর প্রযুক্তি: ইসলামে সম্পূর্ণ জায়েয ও উৎসাহিত (তিরমিজি ২৬৮৭, ইবনে মাজাহ ৯২৫)।\n• সুদ, জুয়া, প্রতারণা ও অনৈতিক কর্ম: ইসলামে কঠোরভাবে নাজায়েজ ও হারাম (সূরা আল-বাক্বারাহ ২:২৭৫)।\n\nআপনার যেকোনো প্রশ্ন বা আলোচনার কথা নিচে লিখুন।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: ['আল-কুরআনুল কারীম', 'সহীহ বুখারী', 'সহীহ মুসলিম'],
          languageUsed: 'bn',
        },
      ],
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('session-default');

  // Firebase Auth Listener: Auto-sync user & database chats
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const synced = await syncUserProfile(firebaseUser);
        setUser(synced);

        // Load chats from Firestore database
        const dbChats = await loadUserChatsFromDb(firebaseUser.uid);
        if (dbChats && dbChats.length > 0) {
          setSessions(dbChats);
          setActiveSessionId(dbChats[0].id);
        }
      } else {
        // Guest mode fallback
        const savedGuest = localStorage.getItem('deen_guest_profile');
        if (savedGuest) {
          try {
            setUser(JSON.parse(savedGuest));
          } catch {
            setUser(GUEST_USER);
          }
        }
        const savedGuestChats = localStorage.getItem('deen_guest_sessions');
        if (savedGuestChats) {
          try {
            const parsed = JSON.parse(savedGuestChats);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSessions(parsed);
              setActiveSessionId(parsed[0].id);
            }
          } catch {
            // ignore
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save guest sessions to localStorage
  useEffect(() => {
    if (!user.userId && sessions.length > 0) {
      try {
        localStorage.setItem('deen_guest_sessions', JSON.stringify(sessions));
      } catch {
        // ignore
      }
    }
  }, [sessions, user.userId]);

  // Save Settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('deen_app_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title: settings.defaultLanguage === 'en' ? 'New Islamic Chat' : 'নতুন ইসলামিক চ্যাট',
      createdAt: new Date().toLocaleDateString(),
      messages: [],
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);

    if (user.userId) {
      saveChatSessionToDb(user.userId, newSession);
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      handleNewChat();
    } else {
      setSessions(remaining);
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
    }

    if (user.userId) {
      await deleteChatFromDb(id);
    }
  };

  const handleClearCurrentChat = () => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const cleared = { ...s, messages: [] };
          if (user.userId) {
            saveChatSessionToDb(user.userId, cleared);
          }
          return cleared;
        }
        return s;
      })
    );
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      languageUsed: settings.defaultLanguage,
    };

    const currentSession = sessions.find((s) => s.id === activeSessionId) || activeSession;
    const updatedMessages = [...(currentSession?.messages || []), userMessage];
    const updatedTitle =
      currentSession?.messages.length === 0
        ? queryText.slice(0, 24) + (queryText.length > 24 ? '...' : '')
        : currentSession.title;

    const updatedSession: ChatSession = {
      ...currentSession,
      title: updatedTitle,
      messages: updatedMessages,
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? updatedSession : s))
    );

    setUser((prev) => ({
      ...prev,
      totalQuestionsAsked: prev.totalQuestionsAsked + 1,
    }));

    setIsProcessing(true);

    // Save user message to database
    if (user.userId) {
      saveChatSessionToDb(user.userId, updatedSession);
    }

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: settings.defaultLanguage,
          history: updatedMessages.slice(-4),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.answer) {
          const aiMessage: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isProhibited: data.isProhibited,
            verdict: data.verdict,
            sources: data.sources || ['পবিত্র কুরআন ও সহীহ সুন্নাহ'],
            scriptureRef: data.scriptureRef,
            languageUsed: settings.defaultLanguage,
          };

          const finalSession: ChatSession = {
            ...updatedSession,
            messages: [...updatedMessages, aiMessage],
          };

          setSessions((prev) =>
            prev.map((s) => (s.id === activeSessionId ? finalSession : s))
          );

          // Save AI answer to database
          if (user.userId) {
            saveChatSessionToDb(user.userId, finalSession);
          }
          return;
        }
      }

      // If server responded without success, handle single graceful fallback
      throw new Error('API did not return valid answer');
    } catch (error) {
      console.warn('Chat request fallback:', error);
      const qLower = queryText.toLowerCase();
      const matched = BILINGUAL_KNOWLEDGE_BASE.find(
        (article) =>
          article.tags.some((tag) => qLower.includes(tag.toLowerCase())) ||
          qLower.includes(article.questionEn.toLowerCase()) ||
          qLower.includes(article.questionBn.toLowerCase())
      );

      const isBn = settings.defaultLanguage !== 'en';
      let reply: ChatMessage;

      if (matched) {
        reply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: isBn ? matched.answerBn : matched.answerEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isProhibited: matched.isProhibitedTopic,
          verdict: isBn ? matched.statusVerdictBn : matched.statusVerdictEn,
          sources: isBn ? matched.sourcesBn : matched.sourcesEn,
          scriptureRef: matched.scriptureRef,
          languageUsed: settings.defaultLanguage,
        };
      } else {
        reply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: isBn
            ? `আস-সালামু আলাইকুম ওয়া রাহমাতুল্লাহ। আপনার প্রশ্ন: "${queryText}"\n\nইসলামী শরিয়তে প্রতিটি কথার বিচার কুরআন ও রাসূলুল্লাহ (ﷺ)-এর সুন্নাহর আলোকে হয়।\n\n• কল্যাণকর কাজ, হালাল উপার্জন, বিজ্ঞান ও প্রযুক্তি: ইসলামে সম্পূর্ণ জায়েয ও অত্যন্ত উৎসাহিত (তিরমিজি ২৬৮৭, ইবনে মাজাহ ৯২৫)।\n• যা কিছু মানুষের ধর্ম, চরিত্র ও সম্পদের ক্ষতিসাধন করে (সুদ, জুয়া, মিথ্যা, প্রতারণা): ইসলামে তা স্পষ্টভাবে নাজায়েজ ও হারাম (সূরা আল-বাক্বারাহ ২:২৭৫)।\n\nআল্লাহ সুবহানাহু ওয়া তা'আলাই সর্বোত্তম জ্ঞানের অধিকারী।`
            : `Assalamu Alaikum. Regarding your inquiry: "${queryText}"\n\nIn Islam, all guidance is rooted in the Holy Quran and authentic Sunnah of Prophet Muhammad (ﷺ).\n\n• Beneficial science, technology, and good deeds are fully encouraged (Tirmidhi 2687).\n• Destructive vices (Interest/Riba, gambling, fraud, deception) are strictly forbidden and Haram (Surah Al-Baqarah 2:275).\n\nAnd Allah knows best.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: ['আল-কুরআনুল কারীম ও সহীহ সুন্নাহ'],
          languageUsed: settings.defaultLanguage,
        };
      }

      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, reply],
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? finalSession : s))
      );

      if (user.userId) {
        saveChatSessionToDb(user.userId, finalSession);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#212121] text-zinc-100 overflow-hidden font-sans antialiased">
      {/* Sidebar (GPT-4 Style) */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onSelectTopic={(prompt) => handleSendMessage(prompt)}
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        language={settings.defaultLanguage}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Chat Area */}
      <ChatArea
        messages={activeSession?.messages || []}
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        user={user}
        settings={settings}
        onUpdateSettings={setSettings}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onClearCurrentChat={handleClearCurrentChat}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Auth Modal (Sign in / Sign up / Google) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(profile) => {
          setUser(profile);
          setIsAuthOpen(false);
        }}
        language={settings.defaultLanguage}
      />

      {/* User Profile & Database Status Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onOpenAuth={() => {
          setIsProfileOpen(false);
          setIsAuthOpen(true);
        }}
        onSignOut={() => setUser(GUEST_USER)}
        language={settings.defaultLanguage}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onClearAllChats={() => {
          setSessions([]);
          handleNewChat();
        }}
      />
    </div>
  );
}
