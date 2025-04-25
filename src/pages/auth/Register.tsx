// src/pages/Register.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { GoogleIcon } from '../../components/common/icons';
import { toast } from 'react-hot-toast';
import * as bcrypt from 'bcryptjs';
import { Country, countries } from '../../data/countries';
import { formatPhoneNumber, validatePhoneNumber } from '../../utils/phoneUtils';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [fullName, setFullName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { signUp, signInWithGoogle, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const securityQuestions = [
    "What was your first pet's name?",
    "What was the name of your first school?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What is your favorite book?",
  ];

  useEffect(() => {
    // If email is passed from login page, set it
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    setPasswordRequirements(requirements);

    if (!requirements.length) {
      return 'Password must be at least 8 characters long';
    }
    if (!requirements.uppercase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!requirements.lowercase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!requirements.number) {
      return 'Password must contain at least one number';
    }
    if (!requirements.special) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value, selectedCountry.code);
    setPhoneNumber(formatted);
    
    const validation = validatePhoneNumber(value, selectedCountry.code);
    setPhoneError(validation.error || '');
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    // Revalidate phone number with new country code
    const validation = validatePhoneNumber(phoneNumber, country.code);
    setPhoneError(validation.error || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwordError) {
      return;
    }
    try {
      // Hash the security answer before sending
      const securityAnswerHash = await bcrypt.hash(securityAnswer, 10);
      
      // Sign up with additional user data
      await signUp(email, password, {
        fullName,
        phoneNumber,
        securityQuestion,
        securityAnswerHash,
        country: selectedCountry.code,
      });

      // Show success message
      toast.success('Account created successfully! Please verify your email.');

      // Redirect to email verification page
      navigate('/verify-email', {
        state: {
          email,
          message: 'Please check your email to verify your account.'
        }
      });
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setPasswordError('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/invalid-email') {
        setPasswordError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setPasswordError('Email/password accounts are not enabled.');
      } else {
        setPasswordError('An error occurred during registration. Please try again.');
      }
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Account created successfully with Google!');
      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        setPasswordError('Google sign in was cancelled');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setPasswordError('An account already exists with this email. Please sign in with your password.');
      } else {
        setPasswordError('An error occurred during Google sign in. Please try again.');
      }
      toast.error(error.message || 'Google sign in failed. Please try again.');
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
              CollabFlow
            </h1>
            <p className="mt-3 text-gray-600">Collaborate and manage your projects efficiently</p>
          </div>
          
          <div className="rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm ring-1 ring-black/5">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {(error || passwordError) && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
                  {error || passwordError}
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

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

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="mt-1 relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400"
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-2" role="img" aria-label={selectedCountry.name}>
                          {selectedCountry.flag}
                        </span>
                        <span>{selectedCountry.name}</span>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
                        <div className="p-2">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search countries..."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="py-1 max-h-60 overflow-auto">
                          {filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              onClick={() => handleCountrySelect(country)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <span className="mr-2 text-lg" role="img" aria-label={country.name}>
                                {country.flag}
                              </span>
                              <span>{country.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400"
                      placeholder={`Enter phone number (${selectedCountry.code})`}
                      required
                      disabled={loading}
                    />
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex h-1 w-full space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-full w-1/5 rounded-full transition-colors ${
                              i <= passwordStrength ? getPasswordStrengthColor(passwordStrength) : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="space-y-1 text-xs text-gray-500">
                        <p>Password requirements:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li className={passwordRequirements.length ? 'text-green-500' : ''}>
                            At least 8 characters
                          </li>
                          <li className={passwordRequirements.uppercase ? 'text-green-500' : ''}>
                            One uppercase letter
                          </li>
                          <li className={passwordRequirements.lowercase ? 'text-green-500' : ''}>
                            One lowercase letter
                          </li>
                          <li className={passwordRequirements.number ? 'text-green-500' : ''}>
                            One number
                          </li>
                          <li className={passwordRequirements.special ? 'text-green-500' : ''}>
                            One special character
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="securityQuestion" className="block text-sm font-medium text-gray-700">
                    Security Question
                  </label>
                  <div className="mt-1">
                    <select
                      id="securityQuestion"
                      value={securityQuestion}
                      onChange={(e) => setSecurityQuestion(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400"
                      required
                      disabled={loading}
                    >
                      <option value="">Select a security question</option>
                      {securityQuestions.map((question) => (
                        <option key={question} value={question}>
                          {question}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-700">
                    Security Answer
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="securityAnswer"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || !!passwordError}
                  className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating account...
                    </div>
                  ) : (
                    'Create account'
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white/80 px-2 text-gray-500 backdrop-blur-sm">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <GoogleIcon className="h-5 w-5" />
                  {loading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-700 border-t-transparent" />
                      Signing up...
                    </div>
                  ) : (
                    'Sign up with Google'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}