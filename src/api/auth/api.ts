import { apiClient } from '@/lib/api-client';
import type { TAuthUser, TLoginRequest, TLoginResponse } from '@/api/auth/type';

export const login = (data: TLoginRequest): Promise<TLoginResponse> => {
  return apiClient.post<TLoginResponse>('/auth/login', data);
};

export const getCurrentUser = (): Promise<TAuthUser> => {
  return apiClient.get<TAuthUser>('/auth/me');
};
