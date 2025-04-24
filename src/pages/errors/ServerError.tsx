import { Link } from 'react-router-dom';
import { 
  WrenchScrewdriverIcon, 
  HomeIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

export default function ServerError() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-red-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl animate-pulse" />
          <h1 className="relative text-9xl font-bold text-white">500</h1>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-red-200">Our servers are having a coffee break!</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Looks like our servers decided to take a quick nap. Our team of highly trained hamsters
            is working hard to get everything back online.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 border border-red-600 text-base font-medium rounded-md text-red-400 hover:bg-red-600/20 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Try Again
          </button>
        </div>

        <div className="mt-8">
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping" />
            <div className="absolute inset-4 bg-red-500/20 rounded-full animate-pulse" />
            <div className="absolute inset-8 bg-red-500/30 rounded-full flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-16 w-16 text-red-400 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 