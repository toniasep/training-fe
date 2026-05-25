import { apiClient } from '@/libs/api-client';
import type { TAuthUser, TLoginRequest, TLoginResponse } from '@/api/auth/types';

export const login = (data: TLoginRequest): Promise<TLoginResponse> => {
  return apiClient.post<TLoginResponse>('/auth/login', data);
};

export const getCurrentUser = (): Promise<TAuthUser> => {
  return apiClient.get<TAuthUser>('/auth/me');
};
