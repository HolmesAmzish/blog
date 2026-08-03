import { useQuery } from '@tanstack/react-query';
import { fetchPictureById } from '../api/picture';
import type { PictureDTO } from '@/types';

export const usePictureById = (id: number | null) =>
  useQuery<PictureDTO, Error>({
    queryKey: ['picture', id],
    queryFn: () => { if (id === null) throw new Error('id required'); return fetchPictureById(id); },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });