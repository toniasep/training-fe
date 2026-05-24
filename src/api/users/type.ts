export type TUserRole = 'Developer' | 'Admin' | 'User';
export type TUserStatus = 'Aktif' | 'Pending' | 'Inactive';

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  status: TUserStatus;
  password: string;
}

export type TCreateUserRequest = Omit<TUser, 'id'>;
export type TUpdateUserRequest = Partial<TCreateUserRequest>;
