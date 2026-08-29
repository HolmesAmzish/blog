import { useQuery } from '@tanstack/react-query';
import { fetchGallery, fetchPicture } from '../api/gallery';
import type { PictureVo } from '@/types/picture';
import type { PageResponse } from '@/types/common';

export const useGallery = (page = 0, size = 24) =>
  useQuery<PageResponse<PictureVo>, Error>({
    queryKey: ['gallery', page, size],
    queryFn: () => fetchGallery(page, size),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

export const useGalleryPicture = (id: number | null) =>
  useQuery<PictureVo, Error>({
    queryKey: ['gallery-picture', id],
    queryFn: () => {
      if (id === null) throw new Error('id required');
      return fetchPicture(id);
    },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });
