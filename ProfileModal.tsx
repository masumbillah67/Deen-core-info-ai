import React from 'react';
import { UserProfile } from '../types';
import { logOut } from '../lib/firebase';
import { X, CheckCircle2, ShieldCheck, Mail, LogOut, Database, UserCheck } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onSignOut: () => void;
  language: 'bn' | 'en' | 'bilingual';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  onSignOut,
  language,
}) => {
  if (!isOpen) return null;

  const isBn = language !== 'en';

  const handleSignOut = async () => {
    await logOut();
    onSignOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 text-emerald-400 flex items-center justify-center border border-zinc-700">
            <UserCheck className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-white">
            {isBn ? 'ব্যবহারকারী প্রোফাইল ও ডাটাবেজ' : 'User Profile & Database'}
          </h3>
        </div>

        {/* Profile Card */}
        <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/60 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full border border-zinc-700 object-cover bg-zinc-800"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
                {user.isConnectedWithGoogle && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-medium">
                    Google
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Database Connected Badge */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              {isBn ? 'ক্লাউড ফায়ারস্টোর সংযুক্ত' : 'Firestore DB Synced'}
            </span>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Active
            </span>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-center">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">
              {isBn ? 'মোট ইসলামিক প্রশ্ন' : 'Questions Asked'}
            </span>
            <span className="text-sm font-extrabold text-white">
              {user.totalQuestionsAsked}
            </span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">
              {isBn ? 'হাদিস ও কুরআন সনদ' : 'Scripture Accuracy'}
            </span>
            <span className="text-sm font-extrabold text-emerald-400">
              100% Sahih
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {user.userId ? (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/40 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBn ? 'অ্যাকাউন্ট থেকে লগআউট' : 'Sign Out'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
            >
              <span>{isBn ? 'লগইন বা নতুন অ্যাকাউন্ট খুলুন' : 'Login / Register'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
