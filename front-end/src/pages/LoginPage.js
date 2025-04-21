import React, { useState, useEffect } from 'react'; // Import useEffect
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

  // Effect to handle navigation after user state is updated
  useEffect(() => {
    if (user && isSubmitting) { // Check if user exists and login was just attempted
      const userRole = user.roles?.[0];
      if (userRole === 'ROLE_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'ROLE_TENANT') {
        navigate('/tenant/dashboard', { replace: true });
      } else {
        // Handle unexpected role or stay on login page?
        setError('Login successful, but role is invalid.');
      }
      setIsSubmitting(false); // Reset submitting state
    }
  }, [user, navigate, isSubmitting]); // Depend on user, navigate, and isSubmitting

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true); // Set submitting state
    try {
      await login(email, password);
      // Navigation is now handled by the useEffect hook when the user state updates
    } catch (error) {
      setError('Invalid email or password');
      // For now, let's assume the response contains role info or we fetch it
      
      // Option 1: Get role from login response (if available)
      // const userRole = loginResponse?.roles?.[0]; // Adjust based on actual response structure

      // Option 2: Fetch user details after login to get role (more reliable if context updates async)
      // This requires AuthService.getCurrentUser() to be called within AuthContext after login
      // Let's assume AuthContext handles setting the user state correctly after login.
      // We might need a slight delay or effect to react to user state change.

      // Simplified approach for now: Check user state after login attempt
      // This might require AuthContext to update user state synchronously or use an effect here.
      // A better approach is to navigate based on the role returned by the login response or fetched user data.

      // Let's modify AuthContext to return user data upon successful login
      console.error('Login error:', error);
      setIsSubmitting(false); // Reset submitting state on error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Apartment Management System
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
