import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPictures,
  uploadPicture,
  deletePicture,
  updatePictureMetadata,
} from '../api/picture';

export const usePictures = (page = 0, size = 20) =>
  useQuery({
    queryKey: ['admin-pictures', page, size],
    queryFn: () => fetchPictures(page, size),
  });

export const useUploadPicture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { file: File; alt?: string; tagIds?: number[]; showInGallery?: boolean }) =>
      uploadPicture(vars.file, vars.alt, vars.tagIds, vars.showInGallery),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-pictures'] }),
  });
};

export const useUpdatePictureMetadata = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      id: number;
      data: { alt?: string; tagIds?: number[]; showInGallery?: boolean };
    }) => updatePictureMetadata(vars.id, vars.data),
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
