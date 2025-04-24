import { useNotificationsStore } from '../../store/notificationsStore';
import { toast } from 'react-hot-toast';

const NotificationPreferences = () => {
  const { preferences, updatePreferences, isSupported } = useNotificationsStore();

  const handlePreferenceChange = async (key: string, value: any) => {
    try {
      await updatePreferences({
        [key]: value
      });
    } catch (error) {
      console.error('Error updating preference:', error);
      toast.error('Failed to update preference');
    }
  };

  const handleTypePreferenceChange = async (type: 'task' | 'project' | 'system', value: boolean) => {
    try {
      await updatePreferences({
        types: {
          ...preferences.types,
          [type]: value
        }
      });
    } catch (error) {
      console.error('Error updating type preference:', error);
      toast.error('Failed to update type preference');
    }
  };

  const handlePriorityChange = async (type: 'task' | 'project' | 'system', value: 'high' | 'normal' | 'low') => {
    try {
      await updatePreferences({
        priority: {
          ...preferences.priority,
          [type]: value
        }
      });
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error('Failed to update priority');
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Push notifications are not supported in your browser. Please use a modern browser like Chrome, Firefox, or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Preferences */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">General Preferences</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Sound</label>
              <p className="text-sm text-gray-500">Play sound when receiving notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.soundEnabled}
                onChange={(e) => handlePreferenceChange('soundEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Vibration</label>
              <p className="text-sm text-gray-500">Vibrate device when receiving notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.vibrationEnabled}
                onChange={(e) => handlePreferenceChange('vibrationEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Badge</label>
              <p className="text-sm text-gray-500">Show unread count badge</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.badgeEnabled}
                onChange={(e) => handlePreferenceChange('badgeEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Types</h3>
        <div className="mt-4 space-y-4">
          {(['task', 'project', 'system'] as const).map((type) => (
            <div key={type} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 capitalize">{type} Notifications</label>
                <p className="text-sm text-gray-500">Receive notifications for {type} updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.types[type]}
                  onChange={(e) => handleTypePreferenceChange(type, e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Priority Settings</h3>
        <div className="mt-4 space-y-4">
          {(['task', 'project', 'system'] as const).map((type) => (
            <div key={type} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 capitalize">{type} Priority</label>
                <p className="text-sm text-gray-500">Set priority level for {type} notifications</p>
              </div>
              <select
                value={preferences.priority[type]}
                onChange={(e) => handlePriorityChange(type, e.target.value as 'high' | 'normal' | 'low')}
                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences; 