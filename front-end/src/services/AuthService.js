import axios from 'axios';
import { localStorageService } from './LocalStorageService'; // Corrected import

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(email, password) {
    return axios.post(API_URL + 'login', {
      email,
      password
    }).then((response) => {
      // Correctly check for 'token' field from JwtResponse DTO
      if (response.data.token) {
        localStorageService.setToken(response.data.token);
        console.log("Token stored:", localStorageService.getToken()); // Log confirmation
      }
      return response.data;
    });
  }

  getCurrentUser() {
    return axios.get(API_URL + 'me', {
      headers: {
        Authorization: 'Bearer ' + localStorageService.getToken()
      }
    });
  }

  logout() {
    localStorageService.removeToken();
  }

  register(email, password) {
    // Assuming the backend has a registration endpoint like this
    return axios.post(API_URL + 'register', {
      email,
      password
      // Add other fields if required by the backend (e.g., name, role preference)
    });
    // Note: Registration might not automatically log the user in or return a token.
    // The flow might require the user to log in separately after registration.
  }
}

export default new AuthService();
