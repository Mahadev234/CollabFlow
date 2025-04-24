import { Link } from 'react-router-dom';
import { RocketLaunchIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
          <h1 className="relative text-9xl font-bold text-white">404</h1>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-200">Houston, we have a problem!</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Looks like you've ventured into the unknown. This page is lost in space.
            Don't worry, we'll help you get back to safety.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Return to Earth
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-400 hover:bg-indigo-600/20 transition-colors"
          >
            <RocketLaunchIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-8">
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping" />
            <div className="absolute inset-4 bg-indigo-500/20 rounded-full animate-pulse" />
            <div className="absolute inset-8 bg-indigo-500/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 