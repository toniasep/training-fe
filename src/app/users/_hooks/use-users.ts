import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, getUserById, createUser, updateUser } from '@/api/users/api';
import type { TUser, TCreateUserRequest, TUpdateUserRequest } from '@/api/users/type';

export const useUsers = (searchQuery: string) => {
  return useQuery<TUser[], Error>({
    queryKey: ['users', searchQuery],
    queryFn: () => getUsers(searchQuery),
  });
};

export const useUserDetail = (id?: string) => {
  return useQuery<TUser, Error>({
    queryKey: ['users', id],
    queryFn: () => {
      if (!id) throw new Error('User ID is required');
      return getUserById(id);
    },
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<TUser, Error, TCreateUserRequest>({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate list of users
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Invalidate audit logs because user creation generates a log
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<TUser, Error, { id: string; data: TUpdateUserRequest }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific user cache and the list
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Invalidate audit logs because user update generates a log
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};
