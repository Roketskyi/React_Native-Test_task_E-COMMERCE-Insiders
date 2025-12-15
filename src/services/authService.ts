import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { User } from '../types';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
  },

  getUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>(API_ENDPOINTS.USERS);
  },

  getUserById: async (id: number): Promise<User> => {
    return apiClient.get<User>(API_ENDPOINTS.USER_BY_ID(id));
  },

  getUserByCredentials: async (credentials: LoginCredentials): Promise<User | null> => {
    try {
      const users = await authService.getUsers();
      const user = users.find(u => u.username === credentials.username);
      return user || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      
      return null;
    }
  },
};