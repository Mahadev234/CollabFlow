import type { Notification } from '../store/notificationsStore';
import { TaskIcon, ProjectIcon, SystemIcon } from '../components/notifications/NotificationIcons';
import type { FC } from 'react';

type NotificationType = 'task' | 'project' | 'system';

// Notification sounds
const notificationSounds = {
  task: '/sounds/task-notification.mp3',
  project: '/sounds/project-notification.mp3',
  system: '/sounds/system-notification.mp3',
};

// Audio elements cache
const audioElements: Record<string, HTMLAudioElement> = {};

// Load and cache audio elements
const loadAudio = (type: keyof typeof notificationSounds) => {
  if (!audioElements[type]) {
    audioElements[type] = new Audio(notificationSounds[type]);
    audioElements[type].load();
  }
  return audioElements[type];
};

// Play notification sound
export const playNotificationSound = (type: NotificationType) => {
  const audio = loadAudio(type);
  audio.play();
};

// Notification icons based on type
export const getNotificationIcon = (type: NotificationType): FC => {
  switch (type) {
    case 'task':
      return TaskIcon;
    case 'project':
      return ProjectIcon;
    case 'system':
      return SystemIcon;
    default:
      return SystemIcon;
  }
};

// Notification colors based on type
export const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'task':
      return 'bg-blue-100 text-blue-800';
    case 'project':
      return 'bg-green-100 text-green-800';
    case 'system':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Format notification message
export const formatNotificationMessage = (notification: Notification) => {
  switch (notification.type) {
    case 'task':
      return `New task assigned: ${notification.body}`;
    case 'project':
      return `Project update: ${notification.body}`;
    case 'system':
      return `System notification: ${notification.body}`;
    default:
      return notification.body;
  }
};

// Format notification timestamp
export const formatNotificationTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return `${seconds}s ago`;
  }
};

// Get notification priority color
export const getPriorityColor = (priority: 'high' | 'normal' | 'low') => {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'normal':
      return 'text-blue-500';
    case 'low':
      return 'text-gray-500';
  }
};

// Check if browser supports notifications
export const checkNotificationSupport = () => {
  return (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!checkNotificationSupport()) {
    throw new Error('Notifications are not supported in this browser');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  return permission;
};

// Create a notification
export const createNotification = (
  title: string,
  options: NotificationOptions
) => {
  if (!checkNotificationSupport()) {
    console.warn('Notifications are not supported in this browser');
    return;
  }

  try {
    new Notification(title, options);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}; 