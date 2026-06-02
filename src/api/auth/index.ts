import { apiClient } from '@/libs/api-client';
import type { TAuthUser, TLoginRequest, TLoginResponse } from '@/api/auth/types';

export const login = async (data: TLoginRequest): Promise<TLoginResponse> => {
  const res = await apiClient.post<TLoginResponse>('/auth/login', data);
  return res.data;
};

export const getCurrentUser = async (): Promise<TAuthUser> => {
  const res = await apiClient.get<TAuthUser>('/auth/me');
  return res.data;
};
