import type { TUser } from '@/api/users/type';

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TAuthUser = Omit<TUser, 'password'>;

export type TLoginResponse = {
  token: string;
  user: TAuthUser;
};
