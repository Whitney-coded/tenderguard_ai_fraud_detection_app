import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, AlertCircle, Settings, Mail, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthDebug from '../components/AuthDebug';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const { sendMagicLink, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const result = await sendMagicLink(email);
    if (result.success) {
      setSuccess(`Magic link sent to ${email}! Check your email and click the link to sign in.`);
      setEmail(''); // Clear the form
    } else {
      setError(result.error || 'An error occurred while sending the magic link');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="flex items-center justify-center">
          <Shield className="h-12 w-12 text-indigo-600" />
          <span className="ml-3 text-2xl font-bold text-gray-900">TenderGuard AI</span>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email and we'll send you a secure magic link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Debug Toggle */}
          <div className="mb-4 text-center">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center mx-auto"
            >
              <Settings className="h-3 w-3 mr-1" />
              {showDebug ? 'Hide' : 'Show'} Debug Info
            </button>
          </div>

          {showDebug && (
            <div className="mb-6">
              <AuthDebug />
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  {error}
                  {error.includes('rate limit') && (
                    <div className="mt-2 text-xs text-red-500">
                      <p>• Wait a few minutes before requesting another magic link</p>
                      <p>• Check your spam folder for previous emails</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  {success}
                  <div className="mt-2 text-xs text-green-600">
                    <p>• Check your email inbox and spam folder</p>
                    <p>• The link will expire in 1 hour</p>
                    <p>• You can request a new link if needed</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Clock className="animate-spin h-4 w-4 mr-2" />
                    Sending magic link...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Send magic link
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">How it works</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Passwordless Authentication</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Enter your email address above</li>
                  <li>• We'll send you a secure magic link</li>
                  <li>• Click the link to sign in instantly</li>
                  <li>• No passwords to remember or manage</li>
                </ul>
              </div>
              
              <Link
                to="/demo"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Book a Demo Instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;