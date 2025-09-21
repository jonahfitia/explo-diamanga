'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import toast from 'react-hot-toast';

interface PatrouillageData {
  name: string;
  currentTop: number;
  completedTops: number[];
  topProgresses: {
    [key: number]: {
      codeEntered: boolean;
      answerSubmitted: boolean;
      completed: boolean;
    };
  };
  createdAt: Timestamp;
  lastActivity: Timestamp;
}

interface AuthContextType {
  user: User | null;
  patrouillageData: PatrouillageData | null;
  loading: boolean;
  signUp: (patrouilleName: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePatrouillageProgress: (topNumber: number, progress: Partial<PatrouillageData['topProgresses'][0]>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [patrouillageData, setPatrouillageData] = useState<PatrouillageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'patrouillages', user.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data() as PatrouillageData;
          setPatrouillageData({
            ...data,
            createdAt: data.createdAt || Timestamp.now(),
            lastActivity: data.lastActivity || Timestamp.now(),
          });
        }
      });

      return unsubscribe;
    } else {
      setPatrouillageData(null);
    }
  }, [user]);

  const signUp = async (patrouilleName: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: patrouilleName
      });

      const initialData: PatrouillageData = {
        name: patrouilleName,
        currentTop: 1,
        completedTops: [],
        topProgresses: {
          1: { codeEntered: false, answerSubmitted: false, completed: false },
          2: { codeEntered: false, answerSubmitted: false, completed: false },
          3: { codeEntered: false, answerSubmitted: false, completed: false },
          4: { codeEntered: false, answerSubmitted: false, completed: false },
        },
        createdAt: Timestamp.now(),
        lastActivity: Timestamp.now(),
      };

      await setDoc(doc(db, 'patrouillages', user.uid), initialData);
      toast.success(`Patrouille "${patrouilleName}" inscrite avec succès !`);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Connexion réussie !');
    } catch (error: any) {
      toast.error('Erreur de connexion. Vérifiez vos identifiants.');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      toast.error('Erreur lors de la déconnexion');
      throw error;
    }
  };

  const updatePatrouillageProgress = async (topNumber: number, progress: Partial<PatrouillageData['topProgresses'][0]>) => {
    if (!user || !patrouillageData) return;

    try {
      const updatedProgress = {
        ...patrouillageData.topProgresses[topNumber],
        ...progress
      };

      const updatedData = {
        ...patrouillageData,
        topProgresses: {
          ...patrouillageData.topProgresses,
          [topNumber]: updatedProgress
        },
        lastActivity: new Date()
      };

      // Si le TOP est complété, ajouter à la liste des TOPs complétés et passer au suivant
      if (updatedProgress.completed && !patrouillageData.completedTops.includes(topNumber)) {
        updatedData.completedTops = [...patrouillageData.completedTops, topNumber];
        if (topNumber < 30) {
          updatedData.currentTop = topNumber + 1;
        }
      }

      await setDoc(doc(db, 'patrouillages', user.uid), updatedData);
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const value = {
    user,
    patrouillageData,
    loading,
    signUp,
    signIn,
    signOut,
    updatePatrouillageProgress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
