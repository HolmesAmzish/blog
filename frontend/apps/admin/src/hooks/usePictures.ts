import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPictures, uploadPicture, deletePicture } from '../api/picture';

export const usePictures = (page = 0, size = 20) =>
  useQuery({
    queryKey: ['admin-pictures', page, size],
    queryFn: () => fetchPictures(page, size),
  });

export const useUploadPicture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadPicture(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-pictures'] }),
  });
};

export const useDeletePicture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePicture(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-pictures'] }),
  });
};
