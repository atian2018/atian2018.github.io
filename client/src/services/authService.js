// Authentication service with offline capability
import { mockAuthService } from './mockDataService';

class AuthService {
  constructor() {
    this.baseURL = '/api';
    this.token = localStorage.getItem('authToken');
  }

  async login(email, password) {
    try {
      // Use mock service for prototype
      return await mockAuthService.login(email, password);
    } catch (error) {
      // Heuristic 9: Help users recognize, diagnose, and recover from errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      // Use mock service for prototype
      return await mockAuthService.getCurrentUser();
    } catch (error) {
      // Clear invalid token
      this.logout();
      throw error;
    }
  }

  logout() {
    this.token = null;
    mockAuthService.logout();
  }

  getAuthHeaders() {
    return mockAuthService.getAuthHeaders();
  }

  isAuthenticated() {
    return mockAuthService.isAuthenticated();
  }
}

export const authService = new AuthService();
