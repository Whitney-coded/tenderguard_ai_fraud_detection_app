import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const AuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runDiagnostics = async () => {
    setIsChecking(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {},
      supabaseConnection: {},
      authSettings: {},
      testUser: {}
    };

    try {
      // Check environment variables
      results.environment = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Present' : 'Missing',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
        urlValue: import.meta.env.VITE_SUPABASE_URL,
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
      };

      // Test Supabase connection
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        results.supabaseConnection = {
          status: error ? 'Failed' : 'Success',
          error: error?.message,
          canAccessProfiles: !error
        };
      } catch (err: any) {
        results.supabaseConnection = {
          status: 'Failed',
          error: err.message,
          canAccessProfiles: false
        };
      }

      // Check auth settings
      try {
        const { data: session } = await supabase.auth.getSession();
        results.authSettings = {
          hasSession: !!session.session,
          sessionUser: session.session?.user?.email || 'None',
          authEnabled: true
        };
      } catch (err: any) {
        results.authSettings = {
          hasSession: false,
          error: err.message,
          authEnabled: false
        };
      }

      // Test user creation (this will help us understand if auth is properly configured)
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';
      
      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword
        });

        results.testUser.signUp = {
          success: !signUpError,
          error: signUpError?.message,
          userCreated: !!signUpData.user,
          needsConfirmation: !signUpData.session && signUpData.user && !signUpError
        };

        // If signup worked, try to sign in
        if (!signUpError && signUpData.user) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
          });

          results.testUser.signIn = {
            success: !signInError,
            error: signInError?.message,
            hasSession: !!signInData.session
          };

          // Clean up test user
          if (signInData.session) {
            await supabase.auth.signOut();
          }
        }
      } catch (err: any) {
        results.testUser = {
          error: err.message,
          authDisabled: err.message.includes('signup') || err.message.includes('disabled')
        };
      }

    } catch (err: any) {
      results.generalError = err.message;
    }

    setDebugInfo(results);
    setIsChecking(false);
  };

  const getStatusIcon = (status: boolean | string) => {
    if (status === true || status === 'Success') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (status === false || status === 'Failed') {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    return <Info className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Debug</h3>
      
      <button
        onClick={runDiagnostics}
        disabled={isChecking}
        className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
      >
        {isChecking ? 'Running Diagnostics...' : 'Run Diagnostics'}
      </button>

      {debugInfo && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              {getStatusIcon(debugInfo.environment.supabaseUrl === 'Present' && debugInfo.environment.supabaseAnonKey === 'Present')}
              <span className="ml-2">Environment Variables</span>
            </h4>
            <div className="text-sm space-y-1">
              <p>Supabase URL: <span className="font-mono">{debugInfo.environment.supabaseUrl}</span></p>
              <p>Anon Key: <span className="font-mono">{debugInfo.environment.supabaseAnonKey}</span> (Length: {debugInfo.environment.keyLength})</p>
              {debugInfo.environment.urlValue && (
                <p className="text-xs text-gray-600">URL: {debugInfo.environment.urlValue}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              {getStatusIcon(debugInfo.supabaseConnection.status)}
              <span className="ml-2">Supabase Connection</span>
            </h4>
            <div className="text-sm space-y-1">
              <p>Status: <span className="font-mono">{debugInfo.supabaseConnection.status}</span></p>
              <p>Can Access Profiles: <span className="font-mono">{debugInfo.supabaseConnection.canAccessProfiles ? 'Yes' : 'No'}</span></p>
              {debugInfo.supabaseConnection.error && (
                <p className="text-red-600">Error: {debugInfo.supabaseConnection.error}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              {getStatusIcon(debugInfo.authSettings.authEnabled)}
              <span className="ml-2">Auth Settings</span>
            </h4>
            <div className="text-sm space-y-1">
              <p>Auth Enabled: <span className="font-mono">{debugInfo.authSettings.authEnabled ? 'Yes' : 'No'}</span></p>
              <p>Current Session: <span className="font-mono">{debugInfo.authSettings.hasSession ? 'Active' : 'None'}</span></p>
              {debugInfo.authSettings.sessionUser !== 'None' && (
                <p>Session User: <span className="font-mono">{debugInfo.authSettings.sessionUser}</span></p>
              )}
              {debugInfo.authSettings.error && (
                <p className="text-red-600">Error: {debugInfo.authSettings.error}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              {getStatusIcon(debugInfo.testUser.signUp?.success || false)}
              <span className="ml-2">Test User Creation</span>
            </h4>
            <div className="text-sm space-y-1">
              {debugInfo.testUser.authDisabled && (
                <p className="text-red-600">⚠️ User registration appears to be disabled</p>
              )}
              {debugInfo.testUser.signUp && (
                <>
                  <p>Sign Up: <span className="font-mono">{debugInfo.testUser.signUp.success ? 'Success' : 'Failed'}</span></p>
                  {debugInfo.testUser.signUp.needsConfirmation && (
                    <p className="text-yellow-600">⚠️ Email confirmation required</p>
                  )}
                  {debugInfo.testUser.signUp.error && (
                    <p className="text-red-600">Sign Up Error: {debugInfo.testUser.signUp.error}</p>
                  )}
                </>
              )}
              {debugInfo.testUser.signIn && (
                <>
                  <p>Sign In: <span className="font-mono">{debugInfo.testUser.signIn.success ? 'Success' : 'Failed'}</span></p>
                  {debugInfo.testUser.signIn.error && (
                    <p className="text-red-600">Sign In Error: {debugInfo.testUser.signIn.error}</p>
                  )}
                </>
              )}
              {debugInfo.testUser.error && (
                <p className="text-red-600">Test Error: {debugInfo.testUser.error}</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Recommendations</h4>
            <div className="text-sm text-blue-800 space-y-1">
              {debugInfo.environment.supabaseUrl === 'Missing' && (
                <p>• Add VITE_SUPABASE_URL to your .env file</p>
              )}
              {debugInfo.environment.supabaseAnonKey === 'Missing' && (
                <p>• Add VITE_SUPABASE_ANON_KEY to your .env file</p>
              )}
              {debugInfo.supabaseConnection.status === 'Failed' && (
                <p>• Check your Supabase project URL and API key</p>
              )}
              {debugInfo.testUser.authDisabled && (
                <p>• Enable email authentication in your Supabase project settings</p>
              )}
              {debugInfo.testUser.signUp?.needsConfirmation && (
                <p>• Consider disabling email confirmation for easier testing</p>
              )}
              {!debugInfo.supabaseConnection.canAccessProfiles && (
                <p>• Ensure your database migrations have been applied</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebug;