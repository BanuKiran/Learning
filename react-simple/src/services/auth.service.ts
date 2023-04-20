import axios from 'axios';

export const API_URL = `http://localhost:8080/api`;

class AuthService {
  logout() {
    localStorage.removeItem('user');
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + 'signup', {
      username,
      email,
      password,
    });
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    return axios.post(API_URL + 'reset-password', {
      token,
      password,
      confirmPassword,
    });
  }

  forgotPassword(email: string) {
    return axios.post(API_URL + 'forgot-password', {
      email,
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
