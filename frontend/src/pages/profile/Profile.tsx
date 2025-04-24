import { useAuthStore } from '../../store/authStore';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
        
        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-3xl text-gray-500">
                {user?.email?.[0].toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.email}</h2>
              <p className="text-gray-600">Member since {new Date(user?.metadata?.creationTime || '').toLocaleDateString()}</p>
            </div>
          </div>

          {/* Account Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Status</label>
                <p className="mt-1 text-gray-900">
                  {user?.emailVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Change Password
              </button>
              <button className="w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 