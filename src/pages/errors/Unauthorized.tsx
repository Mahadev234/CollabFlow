import { Link } from 'react-router-dom';
import { 
  ShieldExclamationIcon, 
  HomeIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-yellow-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="absolute -inset-4 bg-yellow-500/20 rounded-full blur-xl animate-pulse" />
          <h1 className="relative text-9xl font-bold text-white">403</h1>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-yellow-200">Access Denied!</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            This area is restricted to authorized personnel only. Our security system
            has detected an unauthorized access attempt. Please provide proper credentials.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-yellow-600 text-base font-medium rounded-md text-yellow-400 hover:bg-yellow-600/20 transition-colors"
          >
            <LockClosedIcon className="h-5 w-5 mr-2" />
            Login
          </Link>
        </div>

        <div className="mt-8">
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-ping" />
            <div className="absolute inset-4 bg-yellow-500/20 rounded-full animate-pulse" />
            <div className="absolute inset-8 bg-yellow-500/30 rounded-full flex items-center justify-center">
              <ShieldExclamationIcon className="h-16 w-16 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 