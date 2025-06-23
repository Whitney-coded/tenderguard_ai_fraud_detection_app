import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react';

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
      testUser: {},
      databaseAccess: {}
    };

    try {
      // Check environment variables
      results.environment = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Present' : 'Missing',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
        urlValue: import.meta.env.VITE_SUPABASE_URL,
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
        urlValid: import.meta.env.VITE_SUPABASE_URL?.includes('supabase.co') || false
      };

      // Test Supabase connection
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        results.supabaseConnection = {
          status: error ? 'Failed' : 'Success',
          error: error?.message,
          canAccessProfiles: !error,
          errorCode: error?.code
        };
      } catch (err: any) {
        results.supabaseConnection = {
          status: 'Failed',
          error: err.message,
          canAccessProfiles: false
        };
      }

      // Check current auth session
      try {
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        results.authSettings = {
          hasSession: !!session.session,
          sessionUser: session.session?.user?.email || 'None',
          authEnabled: true,
          sessionError: sessionError?.message,
          userConfirmed: session.session?.user?.email_confirmed_at ? 'Yes' : 'No'
        };
      } catch (err: any) {
        results.authSettings = {
          hasSession: false,
          error: err.message,
          authEnabled: false
        };
      }

      // Test database table access
      try {
        const tables = ['profiles', 'documents', 'analysis_results'];
        const tableResults = {};
        
        for (const table of tables) {
          try {
            const { data, error } = await supabase.from(table).select('count').limit(1);
            tableResults[table] = {
              accessible: !error,
              error: error?.message
            };
          } catch (err: any) {
            tableResults[table] = {
              accessible: false,
              error: err.message
            };
          }
        }
        
        results.databaseAccess = tableResults;
      } catch (err: any) {
        results.databaseAccess = {
          error: err.message
        };
      }

      // Test sign-in capability (without actually creating a user)
      try {
        // Try to sign in with invalid credentials to test auth endpoint
        const { error: testError } = await supabase.auth.signInWithPassword({
          email: 'test@nonexistent.com',
          password: 'invalid'
        });
        
        results.testUser.authEndpoint = {
          accessible: true,
          expectedError: testError?.message || 'No error (unexpected)',
          authWorking: testError?.message === 'Invalid login credentials'
        };
      } catch (err: any) {
        results.testUser.authEndpoint = {
          accessible: false,
          error: err.message,
          authWorking: false
        };
      }

    } catch (err: any) {
      results.generalError = err.message;
    }

    setDebugInfo(results);
    setIsChecking(false);
  };

  const clearSession = async () => {
    try {
      await supabase.auth.signOut();
      alert('Session cleared. Please try signing in again.');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
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
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={runDiagnostics}
          disabled={isChecking}
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </button>
        
        <button
          onClick={clearSession}
          className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Clear Session
        </button>
      </div>

      {debugInfo && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              {getStatusIcon(debugInfo.environment.supabaseUrl === 'Present' && debugInfo.environment.supabaseAnonKey === 'Present' && debugInfo.environment.urlValid)}
              <span className="ml-2">Environment Variables</span>
            </h4>
            <div className="text-sm space-y-1">
              <p>Supabase URL: <span className="font-mono">{debugInfo.environment.supabaseUrl}</span></p>
              <p>Anon Key: <span className="font-mono">{debugInfo.environment.supabaseAnonKey}</span> (Length: {debugInfo.environment.keyLength})</p>
              <p>URL Valid: <span className="font-mono">{debugInfo.environment.urlValid ? 'Yes' : 'No'}</span></p>
              {debugInfo.environment.urlValue && (
                <p className="text-xs text-gray-600 break-all">URL: {debugInfo.environment.urlValue}</p>
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
              {debugInfo.supabaseConnection.errorCode && (
                <p className="text-red-600">Error Code: {debugInfo.supabaseConnection.errorCode}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              {getStatusIcon(debugInfo.authSettings.authEnabled && debugInfo.testUser.authEndpoint?.authWorking)}
              <span className="ml-2">Authentication Status</span>
            </h4>
            <div className="text-sm space-y-1">
              <p>Auth Enabled: <span className="font-mono">{debugInfo.authSettings.authEnabled ? 'Yes' : 'No'}</span></p>
              <p>Current Session: <span className="font-mono">{debugInfo.authSettings.hasSession ? 'Active' : 'None'}</span></p>
              <p>Auth Endpoint Working: <span className="font-mono">{debugInfo.testUser.authEndpoint?.authWorking ? 'Yes' : 'No'}</span></p>
              {debugInfo.authSettings.sessionUser !== 'None' && (
                <p>Session User: <span className="font-mono">{debugInfo.authSettings.sessionUser}</span></p>
              )}
              {debugInfo.authSettings.userConfirmed && (
                <p>Email Confirmed: <span className="font-mono">{debugInfo.authSettings.userConfirmed}</span></p>
              )}
              {debugInfo.authSettings.error && (
                <p className="text-red-600">Error: {debugInfo.authSettings.error}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              {getStatusIcon(Object.values(debugInfo.databaseAccess).every((table: any) => table.accessible))}
              <span className="ml-2">Database Access</span>
            </h4>
            <div className="text-sm space-y-1">
              {Object.entries(debugInfo.databaseAccess).map(([table, info]: [string, any]) => (
                <div key={table}>
                  <p>{table}: <span className="font-mono">{info.accessible ? 'Accessible' : 'Failed'}</span></p>
                  {info.error && <p className="text-red-600 text-xs ml-4">Error: {info.error}</p>}
                </div>
              ))}
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
              {!debugInfo.environment.urlValid && (
                <p>• Check that your Supabase URL is correct (should contain 'supabase.co')</p>
              )}
              {debugInfo.supabaseConnection.status === 'Failed' && (
                <p>• Check your Supabase project URL and API key</p>
              )}
              {!debugInfo.testUser.authEndpoint?.authWorking && (
                <p>• Authentication endpoint may not be working - check Supabase auth settings</p>
              )}
              {!debugInfo.supabaseConnection.canAccessProfiles && (
                <p>• Ensure your database migrations have been applied</p>
              )}
              {debugInfo.authSettings.userConfirmed === 'No' && (
                <p>• Consider disabling email confirmation in Supabase Auth settings</p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Quick Fixes</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>1. Clear your browser cache and cookies</p>
              <p>2. Try signing in with a different browser</p>
              <p>3. Check if email confirmation is required in Supabase</p>
              <p>4. Verify your .env file has the correct Supabase credentials</p>
              <p>5. Make sure your Supabase project is not paused</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebug;