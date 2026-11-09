/**
 * AgriVision AI - Authentication Context & Session Provider
 * Manages Firebase Google Sign-In, Email/Password, and Instant Demo mode.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  firebaseSignOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  FirebaseUser,
  db
} from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isDemoUser: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string, name: string, role?: UserProfile['role']) => Promise<void>;
  loginWithDemo: (role?: UserProfile['role']) => void;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_FARMER_USER: UserProfile = {
  uid: 'demo-farmer-789',
  fullName: 'Rameshwar Patil',
  email: 'ramesh.patil.farmer@agrivision.ai',
  phone: '+91 98231 44520',
  region: 'Nashik Agro-Cluster, Maharashtra',
  role: 'farmer',
  createdAt: '2026-01-10T08:00:00Z',
  photoURL: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
};

const DEMO_AGRONOMIST_USER: UserProfile = {
  uid: 'demo-agronomist-456',
  fullName: 'Dr. Ananya Sharma',
  email: 'ananya.sharma@agrivision.ai',
  phone: '+91 94220 88123',
  region: 'Indian Council of Agricultural Research (ICAR)',
  role: 'agronomist',
  createdAt: '2025-11-20T10:00:00Z',
  photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check if demo user saved in localStorage
    const saved = localStorage.getItem('agrivision_session_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    // Default to demo farmer on initial boot for zero-friction evaluation
    return DEMO_FARMER_USER;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(() => {
    return localStorage.getItem('agrivision_is_demo') !== 'false';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        setIsDemoUser(false);
        localStorage.setItem('agrivision_is_demo', 'false');
        
        try {
          const userDocRef = doc(db, 'users', fUser.uid);
          const snap = await getDoc(userDocRef);
          
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUser(data);
            localStorage.setItem('agrivision_session_user', JSON.stringify(data));
          } else {
            // First time Google user profile creation
            const newProfile: UserProfile = {
              uid: fUser.uid,
              fullName: fUser.displayName || 'Farmer User',
              email: fUser.email || '',
              phone: fUser.phoneNumber || '',
              region: 'Western Agricultural Zone',
              role: 'farmer',
              photoURL: fUser.photoURL || undefined,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUser(newProfile);
            localStorage.setItem('agrivision_session_user', JSON.stringify(newProfile));
          }
        } catch (err) {
          console.warn('Firestore user fetch failed, creating local profile:', err);
          const fallbackProfile: UserProfile = {
            uid: fUser.uid,
            fullName: fUser.displayName || 'Farmer User',
            email: fUser.email || '',
            region: 'Regional Farming Cooperative',
            role: 'farmer',
            photoURL: fUser.photoURL || undefined,
            createdAt: new Date().toISOString()
          };
          setUser(fallbackProfile);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      // If popup was blocked or closed, notify
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, role: UserProfile['role'] = 'farmer') => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        fullName: name,
        email,
        role,
        region: 'Agricultural District',
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      } catch (err) {
        console.warn('Could not persist profile in firestore:', err);
      }
      setUser(newProfile);
      localStorage.setItem('agrivision_session_user', JSON.stringify(newProfile));
    } finally {
      setLoading(false);
    }
  };

  const loginWithDemo = (role: UserProfile['role'] = 'farmer') => {
    const selected = role === 'agronomist' ? DEMO_AGRONOMIST_USER : DEMO_FARMER_USER;
    setUser(selected);
    setIsDemoUser(true);
    localStorage.setItem('agrivision_session_user', JSON.stringify(selected));
    localStorage.setItem('agrivision_is_demo', 'true');
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
    setIsDemoUser(false);
    localStorage.removeItem('agrivision_session_user');
    localStorage.setItem('agrivision_is_demo', 'false');
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('agrivision_session_user', JSON.stringify(updated));

    if (!isDemoUser && firebaseUser) {
      try {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      } catch (err) {
        console.warn('Failed to update Firestore profile:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isDemoUser,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginWithDemo,
        logout,
        updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
