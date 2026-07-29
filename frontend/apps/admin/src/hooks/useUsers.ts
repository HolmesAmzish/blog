import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, deleteUser, updateUserRole, setUserEnabled } from '../api/user';
import type { UserDTO } from '@blog/types';

export const useUsers = () =>
  useQuery<UserDTO[], Error>({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => updateUserRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useSetUserEnabled = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) => setUserEnabled(id, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};
