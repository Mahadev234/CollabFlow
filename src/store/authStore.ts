import { create } from 'zustand';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendEmailVerification,
  reload,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import * as bcrypt from 'bcryptjs';


interface UserData {
  fullName: string;
  phoneNumber: string;
  securityQuestion: string;
  securityAnswerHash: string;
  country: string;
}

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, userData?: UserData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: any) => void;
  verifySecurityAnswer: (userId: string, answer: string) => Promise<boolean>;
  checkEmailVerification: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const initializeDatabase = async () => {
  try {
    // Check if users collection exists
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    if (usersSnapshot.empty) {
      // Create initial collections and documents
      const batch = writeBatch(db);
      
      // Create users collection with a sample document
      const sampleUserRef = doc(usersCollection, 'sample');
      batch.set(sampleUserRef, {
        email: 'sample@example.com',
        fullName: 'Sample User',
        phoneNumber: '+1234567890',
        securityQuestion: 'What is your favorite color?',
        securityAnswerHash: await bcrypt.hash('blue', 10),
        country: 'US',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: false,
      });
      
      await batch.commit();
      console.log('Database initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database when the store is created
initializeDatabase();

export const useAuthStore = create<AuthState>((set) => {
  // Set up auth state listener only once when the store is created
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          set({ 
            user: { ...user, ...userData },
            loading: false,
            error: null
          });
        } else {
          set({ user, loading: false, error: null });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        set({ user, loading: false, error: null });
      }
    } else {
      set({ user: null, loading: false, error: null });
    }
  });

  return {
    user: null,
    loading: true,
    error: null,
    signIn: async (email: string, password: string, rememberMe = false) => {
      set({ loading: true, error: null });
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
    signUp: async (email: string, password: string, userData?: UserData) => {
      set({ loading: true, error: null });
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (userData) {
          await setDoc(doc(db, 'users', user.uid), {
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        
        await sendEmailVerification(user);
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
    signOut: async () => {
      set({ loading: true, error: null });
      try {
        await firebaseSignOut(auth);
        set({ user: null, loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
    signInWithGoogle: async () => {
      set({ loading: true, error: null });
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          // Create new user document if it doesn't exist
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
    verifyEmail: async () => {
      set({ loading: true, error: null });
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        await sendEmailVerification(user);
        set({ loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
    reloadUser: async () => {
      set({ loading: true, error: null });
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        await reload(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          set({ 
            user: { ...user, ...userData },
            loading: false
          });
        }
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
    sendPasswordResetEmail: async (email: string) => {
      set({ loading: true, error: null });
      try {
        await sendPasswordResetEmail(auth, email);
        set({ loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
    confirmPasswordReset: async (oobCode: string, newPassword: string) => {
      set({ loading: true, error: null });
      try {
        await confirmPasswordReset(auth, oobCode, newPassword);
        set({ loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
    setUser: (user) => set({ user }),
    verifySecurityAnswer: async (userId: string, answer: string) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
          return false;
        }
        
        const userData = userDoc.data();
        return await bcrypt.compare(answer, userData.securityAnswerHash);
      } catch (error) {
        console.error('Error verifying security answer:', error);
        return false;
      }
    },
    checkEmailVerification: async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return false;
        
        await reload(currentUser);
        return currentUser.emailVerified;
      } catch (error) {
        throw error;
      }
    },
    resendVerificationEmail: async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error('No user found');
        
        await sendEmailVerification(currentUser);
      } catch (error) {
        throw error;
      }
    }
  };
});