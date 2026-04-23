/**
 * Pictures Hooks
 * React Query hooks for picture operations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPictures,
  fetchPictureById,
  uploadPicture,
  updatePictureAlt,
  deletePicture,
} from '../api/picture';
import type { PictureDTO, PicturePageResponse } from '../types';

const PICTURES_KEY = 'pictures';

/**
 * Hook to fetch paginated pictures
 */
export const usePictures = (page: number = 0, size: number = 10) => {
  return useQuery<PicturePageResponse, Error>({
    queryKey: [PICTURES_KEY, page, size],
    queryFn: () => fetchPictures(page, size),
  });
};

/**
 * Hook to fetch a picture by ID
 */
export const usePictureById = (id: number | null) => {
  return useQuery<PictureDTO, Error>({
    queryKey: [PICTURES_KEY, 'detail', id],
    queryFn: () => fetchPictureById(id!),
    enabled: !!id,
  });
};

/**
 * Hook to upload picture
 */
export const useUploadPicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadPicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PICTURES_KEY] });
    },
  });
};

/**
 * Hook to update picture alt text
 */
export const useUpdatePictureAlt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, alt }: { id: number; alt: string }) =>
      updatePictureAlt(id, alt),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PICTURES_KEY] });
      queryClient.invalidateQueries({
        queryKey: [PICTURES_KEY, 'detail', variables.id],
      });
    },
  });
};

/**
 * Hook to delete picture
 */
export const useDeletePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PICTURES_KEY] });
    },
  });
};
