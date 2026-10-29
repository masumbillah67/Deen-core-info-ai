import React, { useState } from 'react';
import { 
  signInWithGoogle, 
  loginWithEmail, 
  registerWithEmail 
} from '../lib/firebase';
import { UserProfile } from '../types';
import { X, Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  language: 'bn' | 'en' | 'bilingual';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  language,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isBn = language !== 'en';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const user = await signInWithGoogle();
      if (user) {
        onAuthSuccess({
          userId: user.uid,
          name: user.displayName || 'User',
          email: user.email || 'user@deen.ai',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}&backgroundColor=059669`,
          isConnectedWithGoogle: true,
          joinedAt: new Date().toLocaleDateString(),
          totalQuestionsAsked: 0,
        });
        onClose();
      }
    } catch (err: unknown) {
      setErrorMsg(isBn ? 'গুগল সাইন-ইন সম্পন্ন করা সম্ভব হয়নি।' : 'Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।' : 'Please enter email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        const user = await registerWithEmail(email, password, displayName);
        if (user) {
          onAuthSuccess({
            userId: user.uid,
            name: displayName || email.split('@')[0],
            email: user.email || email,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${displayName || email}&backgroundColor=059669`,
            isConnectedWithGoogle: false,
            joinedAt: new Date().toLocaleDateString(),
            totalQuestionsAsked: 0,
          });
          onClose();
        }
      } else {
        const user = await loginWithEmail(email, password);
        if (user) {
          onAuthSuccess({
            userId: user.uid,
            name: user.displayName || email.split('@')[0],
            email: user.email || email,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || email}&backgroundColor=059669`,
            isConnectedWithGoogle: false,
            joinedAt: new Date().toLocaleDateString(),
            totalQuestionsAsked: 0,
          });
          onClose();
        }
      }
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : '';
      if (errStr.includes('email-already-in-use')) {
        setErrorMsg(isBn ? 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।' : 'Email already in use.');
      } else if (errStr.includes('wrong-password') || errStr.includes('user-not-found') || errStr.includes('invalid-credential')) {
        setErrorMsg(isBn ? 'ভুল ইমেইল অথবা পাসওয়ার্ড।' : 'Invalid email or password.');
      } else {
        setErrorMsg(isBn ? 'অ্যাকাউন্ট প্রমাণীকরণ ব্যর্থ হয়েছে।' : 'Authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
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

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 mx-auto flex items-center justify-center text-emerald-400 font-bold text-sm mb-2">
            د
          </div>
          <h3 className="text-lg font-bold text-white">
            {isRegister
              ? (isBn ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create an Account')
              : (isBn ? 'লগইন করুন' : 'Sign in to Deen Core AI')}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn
              ? 'আপনার চ্যাট হিস্ট্রি ও ডাটাবেজ সিঙ্কের জন্য'
              : 'Sync your Islamic chats to the database'}
          </p>
        </div>

        {/* Google One-Tap Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer mb-4"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isBn ? 'গুগল দিয়ে প্রবেশ করুন' : 'Continue with Google'}</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-[11px] text-slate-500 uppercase font-semibold">
            {isBn ? 'অথবা ইমেইল' : 'or with email'}
          </span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-950/50 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder={isBn ? 'মাসুম বিল্লাহ' : 'Your Name'}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              {isBn ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>{isRegister ? (isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Sign Up') : (isBn ? 'লগইন করুন' : 'Sign In')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            {isRegister
              ? (isBn ? 'আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন' : 'Already have an account? Sign In')
              : (isBn ? 'নতুন ব্যবহারকারী? একটি অ্যাকাউন্ট খুলুন' : "Don't have an account? Sign Up")}
          </button>
        </div>
      </div>
    </div>
  );
};
