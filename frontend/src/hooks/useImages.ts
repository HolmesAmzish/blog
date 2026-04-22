/**
 * Images Hooks
 * React Query hooks for image operations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchImages,
  fetchImageById,
  uploadImage,
  updateImageAlt,
  deleteImage,
} from '../api/image';
import type { ImageDTO, ImagePageResponse } from '../types';

const IMAGES_KEY = 'images';

/**
 * Hook to fetch paginated images
 */
export const useImages = (page: number = 0, size: number = 10) => {
  return useQuery<ImagePageResponse, Error>({
    queryKey: [IMAGES_KEY, page, size],
    queryFn: () => fetchImages(page, size),
  });
};

/**
 * Hook to fetch a image by ID
 */
export const useImageById = (id: number | null) => {
  return useQuery<ImageDTO, Error>({
    queryKey: [IMAGES_KEY, 'detail', id],
    queryFn: () => fetchImageById(id!),
    enabled: !!id,
  });
};

/**
 * Hook to upload image
 */
export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [IMAGES_KEY] });
    },
  });
};

/**
 * Hook to update image alt text
 */
export const useUpdateImageAlt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, alt }: { id: number; alt: string }) =>
      updateImageAlt(id, alt),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [IMAGES_KEY] });
      queryClient.invalidateQueries({
        queryKey: [IMAGES_KEY, 'detail', variables.id],
      });
    },
  });
};

/**
 * Hook to delete image
 */
export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [IMAGES_KEY] });
    },
  });
};
