import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDDq2_5KEUM007BJgd3iRk_23J_xxc8IMQ",
  authDomain: "explo-diamanga.firebaseapp.com",
  projectId: "explo-diamanga",
  storageBucket: "explo-diamanga.firebasestorage.app",
  messagingSenderId: "442326761517",
  appId: "1:442326761517:web:c134ac2671e0193e5ef8a4",
  measurementId: "G-VHVD334DKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;