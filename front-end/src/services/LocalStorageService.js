// Simple service for interacting with localStorage
export const localStorageService = {
  getToken: () => {
    return localStorage.getItem('accessToken');
  },
  setToken: (token) => {
    localStorage.setItem('accessToken', token);
  },
  removeToken: () => {
    localStorage.removeItem('accessToken');
  },
  // Add other methods as needed, e.g., for user info or theme
  getUserRole: () => {
    // Example: Assuming role is stored separately or decoded from token elsewhere
    // This might be better handled by decoding the JWT after login
    return localStorage.getItem('userRole');
  },
  setUserRole: (role) => {
    // Storing role separately might be redundant if it's in the JWT
    localStorage.setItem('userRole', role);
  },
  removeUserRole: () => {
    localStorage.removeItem('userRole');
  },
  getDarkMode: () => {
    return localStorage.getItem('darkMode') === 'true';
  },
  setDarkMode: (isDark) => {
    localStorage.setItem('darkMode', String(isDark));
  }
};
