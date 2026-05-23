import { apiClient } from '../../lib/api-client';
import type { TUser } from '../users/type';

export interface LoginResponse {
  token: string;
  user: TUser;
}

export const authApi = {
  login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', { email, password });
  },

  getCurrentUser(): Promise<TUser> {
    return apiClient.get<TUser>('/auth/me');
  },
};
