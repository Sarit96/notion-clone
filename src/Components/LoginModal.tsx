import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log('Google Login Success:', credentialResponse);
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log('Decoded token:', decoded);
      
      // Create user object matching our User interface
      const googleUser = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      };

      // Store the token and user data
      localStorage.setItem('googleUser', JSON.stringify(googleUser));
      setUser(googleUser);
      onClose();
    } catch (err) {
      console.error('Google login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during Google login');
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign-in failed');
    setError('Google sign-in was unsuccessful');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Login to Notion</h2>
        
        {/* Google Sign-In Button */}
        <div className="mb-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            type="standard"
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="250"
          />
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-black dark:text-white disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 