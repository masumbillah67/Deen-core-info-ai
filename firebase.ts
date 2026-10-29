import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { ChatSession, UserProfile } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export type User = FirebaseUser;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const onAuthStateChanged = (
  authInstance: ReturnType<typeof getAuth>,
  callback: (user: User | null) => void
) => firebaseOnAuthStateChanged(authInstance, callback);

export async function syncUserProfile(firebaseUser: User): Promise<UserProfile> {
  return {
    name:
      firebaseUser.displayName ||
      firebaseUser.email?.split('@')[0] ||
      'User',
    email: firebaseUser.email || '',
    avatar:
      firebaseUser.photoURL ||
      'https://api.dicebear.com/7.x/initials/svg?seed=User',
    isConnectedWithGoogle: !!firebaseUser.providerData?.length,
    joinedAt: new Date().toLocaleDateString(),
    totalQuestionsAsked: 0,
    userId: firebaseUser.uid,
  };
}

export async function saveChatSessionToDb(
  userId: string,
  session: ChatSession
): Promise<void> {
  console.log('saveChatSessionToDb', userId, session);
}

export async function loadUserChatsFromDb(
  userId: string
): Promise<ChatSession[] | null> {
  console.log('loadUserChatsFromDb', userId);
  return null;
}

export async function deleteChatFromDb(chatId: string): Promise<void> {
  console.log('deleteChatFromDb', chatId);
}
