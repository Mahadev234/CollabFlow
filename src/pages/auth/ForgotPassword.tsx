import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await resetPassword(email);
      toast.success('Password reset email sent!');
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
              CollabFlow
            </h1>
            <p className="mt-3 text-gray-600">Reset your password</p>
          </div>
          
          <div className="rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm ring-1 ring-black/5">
            {success ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Check your email
                </h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                </p>
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Return to login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Forgot your password?
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </div>
                    ) : (
                      'Send reset link'
                    )}
                  </button>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Back to login
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 