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
  sendPasswordResetEmail
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
  signInWithGoogle: (rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: any) => void;
  verifySecurityAnswer: (userId: string, answer: string) => Promise<boolean>;
  checkEmailVerification: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
  // Set up auth state listener
  onAuthStateChanged(auth, async (user) => {
    if (user) {
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
    } else {
      set({ user: null, loading: false, error: null });
    }
  });

  return {
    user: null,
    loading: true, // Start with loading true
    error: null,
    
    signIn: async (email: string, password: string, rememberMe = false) => {
      set({ loading: true, error: null });
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          throw new Error('Please verify your email before signing in');
        }
        
        // Get additional user data
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          set({ 
            user: { ...userCredential.user, ...userData },
            loading: false
          });
        } else {
          set({ user: userCredential.user, loading: false });
        }
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
    
    signUp: async (email: string, password: string, userData?: UserData) => {
      set({ loading: true, error: null });
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Send email verification
        await sendEmailVerification(userCredential.user);
        
        if (userData) {
          // Hash the security answer before storing
          const securityAnswerHash = await bcrypt.hash(userData.securityAnswerHash, 10);
          
          // Store additional user data in Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            ...userData,
            securityAnswerHash,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: false,
          });
        }
        
        set({ user: userCredential.user, loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },

    signInWithGoogle: async (rememberMe = false) => {
      set({ loading: true, error: null });
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        
        // Store Google user data in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          fullName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        set({ user: userCredential.user, loading: false });
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
    },

    resetPassword: async (email: string) => {
      set({ loading: true, error: null });
      try {
        await sendPasswordResetEmail(auth, email);
        set({ loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    }
  };
});