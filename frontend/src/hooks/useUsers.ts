/**
 * useUsers Hook
 * Manages user data fetching and mutations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userApi from '../api/user';
import type { PasswordChangeRequest } from '../types';

/**
 * Hook for fetching all users
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAllUsers,
  });
}

/**
 * Hook for fetching a single user
 */
export function useUser(id: number | null) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUserById(id!),
    enabled: id !== null,
  });
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook for changing user password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: PasswordChangeRequest }) =>
      userApi.changePassword(id, request),
  });
}

/**
 * Hook for updating user role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      userApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook for setting user enabled status
 */
export function useSetUserEnabled() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) =>
      userApi.setUserEnabled(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}