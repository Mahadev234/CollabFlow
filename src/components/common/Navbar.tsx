import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationsStore } from '../../store/notificationsStore';
import { useState, useRef, useEffect } from 'react';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const { 
    notifications, 
    unreadCount, 
    initializeMessaging, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationsStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      initializeMessaging();
    }
  }, [user, initializeMessaging]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <nav className="fixed right-0 top-0 z-[45] w-[calc(100%-16rem)] border-b border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 lg:left-64">
      <div className="px-6">
        <div className="flex h-16 items-center justify-end">
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="group relative rounded-xl bg-gray-100 p-2.5 text-gray-600 transition-all duration-300 hover:bg-gray-200 hover:text-gray-900"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white/80 p-2 shadow-xl ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                        <div className="rounded-full bg-gray-100 p-3">
                          <BellIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`group flex items-start gap-3 rounded-lg px-4 py-3 transition-colors ${
                            !notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                              <BellIcon className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {notification.body}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="flex-shrink-0 rounded-full p-1.5 text-blue-600 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-blue-100"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="group flex items-center gap-2 rounded-xl bg-gray-100 p-2.5 text-gray-600 transition-all duration-300 hover:bg-gray-200 hover:text-gray-900"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8" />
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/80 p-2 shadow-xl ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300">
                  <div className="border-b border-gray-200 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.displayName || user?.email}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <UserCircleIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <Cog6ToothIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      Settings
                    </Link>

                    <Link
                      to="/help"
                      className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      Help & Support
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="group flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}