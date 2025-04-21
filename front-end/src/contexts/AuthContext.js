import React, { createContext, /* useContext, */ useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { localStorageService } from '../services/LocalStorageService'; // Corrected import

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorageService.getToken();
        if (token) {
          // AuthService.getCurrentUser() returns the axios response object
          const response = await AuthService.getCurrentUser();
          // Assuming the actual user data is in response.data
          // Adjust structure based on what /api/auth/me actually returns
          if (response.data) {
             // Ensure the structure matches what login sets: { id, email, roles }
             // If /me returns a different structure, adapt it here.
             setUser({
                 id: response.data.id, // Example mapping
                 email: response.data.email, // Example mapping
                 roles: response.data.roles // Example mapping
             });
          } else {
             // Handle case where /me doesn't return expected data
             localStorageService.removeToken();
             setUser(null);
          }
        }
      } catch (error) {
        // If getCurrentUser fails (e.g., token expired), remove token and clear user
        localStorageService.removeToken();
        setUser(null); // Ensure user state is cleared
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password); // AuthService.login returns the response data
      if (response.token) { // Check if login was successful (token received from JwtResponse)
        // Extract user details from the response (based on JwtResponse DTO)
        const userData = {
          id: response.id,
          email: response.email, // email field in JwtResponse holds the username/email
          roles: response.roles,
          token: response.token
        };
        setUser(userData); // Update the user state in the context
        // localStorageService.setUserRole(response.roles[0]); // Optional: store role if needed elsewhere
      }
      return response; // Return the full response data
    } catch (error) {
      logout(); // Clear user state and token on login failure
      throw error; // Re-throw the error to be caught by the calling component
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const register = async (email, password) => {
    // Call the AuthService register method
    // Handle potential errors (e.g., email already exists)
    return AuthService.register(email, password);
    // Decide the flow after registration: auto-login or redirect to login?
    // For now, it just calls the service. The component handles redirection.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}> {/* Add register to context value */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// export const useAuth = () => useContext(AuthContext);
export { AuthContext };
