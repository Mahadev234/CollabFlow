import { create } from 'zustand';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthStore } from './authStore';
import { playNotificationSound } from '../utils/notificationUtils';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: 'task' | 'project' | 'system';
  createdAt: Date;
  data?: Record<string, any>;
  action?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  icon?: string;
  requireInteraction?: boolean;
  tag?: string;
  renotify?: boolean;
}

export interface NotificationPreferences {
  soundEnabled: boolean;
  desktopEnabled: boolean;
  emailEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
  types: {
    task: boolean;
    project: boolean;
    system: boolean;
  };
  priority: {
    task: 'high' | 'normal' | 'low';
    project: 'high' | 'normal' | 'low';
    system: 'high' | 'normal' | 'low';
  };
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  preferences: NotificationPreferences;
  fcmToken: string | null;
  isSupported: boolean;
  initializeMessaging: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  checkBrowserSupport: () => boolean;
}

const defaultPreferences: NotificationPreferences = {
  soundEnabled: true,
  desktopEnabled: true,
  emailEnabled: false,
  vibrationEnabled: true,
  badgeEnabled: true,
  types: {
    task: true,
    project: true,
    system: true,
  },
  priority: {
    task: 'normal',
    project: 'normal',
    system: 'low',
  },
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, { name: 'notifications' });
const auth = getAuth(app);

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    type?: 'task' | 'project' | 'system';
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
    requireInteraction?: string;
    tag?: string;
    renotify?: string;
    [key: string]: any;
  };
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  preferences: defaultPreferences,
  fcmToken: null,
  isSupported: false,

  checkBrowserSupport: () => {
    const isSupported = 
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window &&
      'indexedDB' in window;
    
    set({ isSupported });
    return isSupported;
  },

  initializeMessaging: async () => {
    try {
      set({ loading: true, error: null });

      // Check if user is authenticated
      const { user } = useAuthStore.getState();
      if (!user) {
        throw new Error('User must be authenticated to enable notifications');
      }

      // Wait for auth to be ready
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user);
        });
      });

      // Check browser support
      if (!get().checkBrowserSupport()) {
        throw new Error('Push notifications are not supported in this browser');
      }

      // Check if running in secure context
      if (window.isSecureContext === false) {
        throw new Error('Push notifications require a secure context (HTTPS)');
      }

      const messaging = getMessaging(app);

      // Request permission for notifications
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      });

      if (!token) {
        throw new Error('No registration token available. Make sure you have a valid VAPID key configured.');
      }

      if (token) {
        set({ fcmToken: token });

        // Store token in Firestore
        if (user) {
          await setDoc(
            doc(db, 'users', user.uid),
            { fcmToken: token },
            { merge: true }
          );
        }
      }

      // Handle foreground messages
      onMessage(messaging, (payload: NotificationPayload) => {
        console.log('Message received:', payload);
        
        const { preferences } = get();
        const notificationType = payload.data?.type || 'system';

        // Check if this type of notification is enabled
        if (!preferences.types[notificationType]) {
          return;
        }

        // Play sound if enabled
        if (preferences.soundEnabled) {
          playNotificationSound(notificationType);
        }

        // Show toast notification
        toast(payload.notification?.body || 'New notification', {
          duration: 4000,
          position: 'top-right',
        });
        
        // Add to notifications list
        get().addNotification({
          title: payload.notification?.title || 'New Notification',
          body: payload.notification?.body || '',
          type: notificationType,
          data: payload.data,
          actions: payload.data?.actions,
          requireInteraction: payload.data?.requireInteraction === 'true',
          tag: payload.data?.tag,
          renotify: payload.data?.renotify === 'true'
        });
      });

      set({ loading: false });
    } catch (error) {
      console.error('Error initializing messaging:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initialize notifications',
        loading: false 
      });
      toast.error('Failed to initialize notifications');
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          read: false,
          createdAt: new Date(),
          ...notification
        },
        ...state.notifications
      ],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: async (id) => {
    try {
      const { user } = useAuthStore.getState();
      if (user) {
        await setDoc(
          doc(db, 'notifications', id),
          { read: true },
          { merge: true }
        );
      }

      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  },

  markAllAsRead: async () => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) return;

      const batch = writeBatch(db);
      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, where('userId', '==', user.uid), where('read', '==', false));

      const snapshot = await getDocs(q);
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });

      await batch.commit();

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  updatePreferences: async (newPreferences: Partial<NotificationPreferences>) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) return;

      const { preferences } = get();
      const updatedPreferences = { ...preferences, ...newPreferences };

      await setDoc(
        doc(db, 'users', user.uid),
        { notificationPreferences: updatedPreferences },
        { merge: true }
      );

      set({ preferences: updatedPreferences });
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
    }
  },
})); 