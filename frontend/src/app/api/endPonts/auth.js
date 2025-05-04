// auth.js
import { APIHandler } from "../apiHandler";

class AuthService {
  constructor() {
    this.api = new APIHandler();
  }

  async login(email, password) {
    const response = await this.api.post('/auth/login', { email, password });
    
    if (response.success && response.data?.token) {
      this.api.setToken(response.data.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.api.post('/auth/register', userData);
    
    if (response.success && response.data?.token) {
      this.api.setToken(response.data.token);
    }
    
    return response;
  }

  async fetchCurrentUser() {
    return await this.api.get('/user');
  }

  async logout() {
    const response = await this.api.post('/auth/logout');
    this.api.removeToken();
    return response;
  }

  isAuthenticated() {
    return !!this.api.getToken();
  }
  
  async sendResetPasswordEmail(email) {
    return await this.api.post('/auth/sendResetPasswordEmail', { email });
  }
  
  async verifyEmail(token) {
    return await this.api.get('/auth/verify-email', { token });
  }

}

// Create a singleton instance
const authService = new AuthService();

export default authService;