export type TUserRole = 'admin' | 'operator' | 'viewer';
export type TUserStatus = 'active' | 'invited' | 'suspended';

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  status: TUserStatus;
  createdAt: string;
  password?: string;
}

export type TCreateUserRequest = Omit<TUser, 'id' | 'createdAt'> & { password?: string };
export type TUpdateUserRequest = Partial<Omit<TUser, 'id' | 'createdAt'>> & { password?: string };

